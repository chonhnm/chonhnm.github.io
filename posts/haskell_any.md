---
title: 'Haskell Any vs C++ Varaint'
date: '2023-10-25'
---

Java的Class文件中，有一个重要的符号引用列表，即常量池列表。常量池列表中包含各种常量项，在JVM21规范中共有17种常量项。比如：CONSTANT_Class、CONSTANT_Integer、CONSTANT_Utf8等。那么如何使用Haskell表示常量项？

# 代数类型 (直观的方式)

## 常量池数据建模    

使用Haskell对常量项建模，我们很容易想到使用sum type。CPEntry表示常量项类型，它的各个数据构造器（data constructor）对应不同的常量项值。

```Haskell
data CPEntry
  = Constant_Invalid
  | Constant_Utf8 ConstUtf8
  | Constant_Integer ConstInteger
  | Constant_Float ConstFloat
  | Constant_Long ConstLong
  | Constant_Double ConstDouble
  | Constant_Class ConstClass
  | Constant_String ConstString
  | Constant_Fieldref ConstFieldref
  | Constant_Methodref ConstMethodref
  | Constant_InterfaceMethodref ConstInterfaceMethodref
  | Constant_NameAndType ConstNameAndType
  | Constant_MethodHandle ConstMethodHandle
  | Constant_MethodType ConstMethodType
  | Constant_Dynamic ConstDynamic
  | Constant_InvokeDynamic ConstInvokeDynamic
  | Constant_Module ConstModule
  | Constant_Package ConstPackage
  deriving (Typeable, Show)
```
相应的，常量池就是常量项的列表。  
```Haskell
type CPInfo = [CPEntry]
```  

## 从常量池中获取常量项  

从Class文件解析出常量池后，我们不时需要从某个索引下获取某个常量项。因为该索引下的常量项是任意的，所以就有可能与你想要的不匹配。比如你想获取一个CONSTANT_Utf8，可以使用模式匹配，如果类型一致返回Just，不一致返回Nothing。 
```Haskell
getConstUtf8 :: CPEntry -> Maybe ConstUtf8
getConstUtf8 (Constant_Utf8 x) = Just x 
getConstUtf8 _ = Nothing 
```

想要获取ConstClass？同样的：  
```Haskell
getConstClass :: CPEntry -> Maybe ConstClass
getConstClass (Constant_Class x) = Just x 
getConstClass _ = Nothing
```

后面还有15个不同的常量项需要这样定义。显然，这样做很繁琐，但是可行的（It works）。

## 使用Dynamic（To the rescue）

首先使用toDyn将CPEntry转为Dynamic。  
```Haskell
toDyn :: Typeable a => a -> Dynamic
```

```Haskell
cpEntryDyn :: CPEntry -> Dynamic
cpEntryDyn info =
   case info of
    Constant_Invalid -> toDyn ()
    Constant_Utf8 x ->  toDyn x
    Constant_Integer x ->  toDyn x
    Constant_Float x ->  toDyn x
    Constant_Long x ->  toDyn x
    Constant_Double x ->  toDyn x
    Constant_Class x ->  toDyn x
    Constant_String x ->  toDyn x
    Constant_Fieldref x ->  toDyn x
    Constant_Methodref x ->  toDyn x
    Constant_InterfaceMethodref x ->  toDyn x
    Constant_NameAndType x ->  toDyn x
    Constant_MethodHandle x ->  toDyn x
    Constant_MethodType x ->  toDyn x
    Constant_Dynamic x ->  toDyn x
    Constant_InvokeDynamic x ->  toDyn x
    Constant_Module x ->  toDyn x
    Constant_Package x ->  toDyn x
```  

再使用fromDynamic将Dynamic对象转化为你想要的对象（通过type signature指定）。因为实际的和你想要的对象可能不一致，所以fromDynamic的返回值也是Maybe。  
```Haskell
fromDynamic :: forall a. Typeable a => Dynamic -> Maybe a     
```  

利用上面的两个函数，我们可以定义一个通用的的getCPEntry函数。  
```Haskell
getCPEntry :: (Typeable a) => CPEntry -> Maybe a
getCPEntry = fromDynamic . cpEntryDyn
```  

这样只要指定类型，就可以分别定义出`getConstUtf8`和`getConstClass`。  
```Haskell
getConstUtf8 = getCPEntry :: Maybe ConstUtf8
getConstClass = getCPEntry :: Maybe ConstClass
```

但一般情况，我们不再需要定义`getConstUtf8`等。类型可以通过上下文自动推导出来。比如获取ConstUtf8的文本值。  
```Haskell
newtype ConstUtf8 = ConstUtf8 T.Text deriving (Show)

getUtf8Value :: CPInfo -> Maybe T.Text 
getUtf8Value entry = do 
  ConstUtf8 x <- getCPEntry entry
  return x
```

## 定义多态方法（Polymorphic） 

上述`cpEntryDyn`方法其实就是一个多态方法。通过模式匹配将各个常量项转为Dynamic。  
如果我们想将CPEntry转为不同的Tag值，可以这样定义：  

```Haskell
tagCPEntry :: CPEntry -> CPTag
tagCPEntry Constant_Invalid -> JVM_Constant_Invalid
tagCPEntry (Constant_Utf8 _) ->  JVM_Constant_Utf8
tagCPEntry (Constant_Integer _) ->  JVM_Constant_Integer
...
```  
或者转为pretty的Doc类型，以便格式化输出：  
```Haskell
pprCPEntry :: CPInfo -> CPReader Doc
pprCPEntry Constant_Invalid = return PP.empty
pprCPEntry (Constant_Utf8 x) = ppr x
pprCPEntry (Constant_Integer x) = ppr x
...
```

### 扩展性问题

如果JVM规范后面又新增了一种常量项，比如`Constant_Magic`，那么所有这些使用了模式匹配的地方都需要修改。否则会有编辑器提示`Pattern match(es) are non-exhaustive`。这种提示是友好的，因为缺失的模式匹配往往意味着业务BUG，我们甚至可以添加编译参数，使编译器在这个情况下报错。

如果业务变化不大，这种方式也许还不错。但也可以尝试另外一种常量项建模方式...

# Existential Types(Another way...)

### Algebraic data type、Abstract data type和Generalized Algebraic Type

Algebraic data type指代数数据类型。这里的代数指代数和（sum）或代码乘（product）。也就是说数据类型可以像代数一样做“加法“或“乘法“。代数和表示选择，代数乘表示组合。比如：  
`data Fruit = Apple | Banana | OtherFruit`。水果表示苹果或者香蕉或其他水果。  
`data Point = P Int Int`。点由x坐标和y坐标一起组成。
我们称`Fruit`和`Point`为类型构造器（type constructor），`Apple`、`Banana`、`OtherFruit`、`P`为数据构造器（data constructor）。 

GADT可以使我们在定义数据类型时，将数据构造器的类型明确的写出来。如使用GADT重新定义的Point如下：  
```Haskell
data Point where 
  P :: Int -> Int -> Point
```  

Abstract data type指抽象数据类型，Haskell需要通过module的机制实现。用于隐藏数据的具体实现，只提供操作数据的方法。

## Any（Like Java Object）
Haskell列表是同质的，也就是说列表中的元素类型要相同。对于17种常量项，数据类型各不相同，我们没法将他们一并放入某个列表中，所以就需要上述的`CPEntry`类型封装成统一类型，然后通过模式匹配解构出`CPEntry`中的实际的常量项。 
```Haskell
-- error: 
-- Couldn't match expected type ‘ConstUtf8’
--              with actual type ‘ConstInteger’
entries = [ConstUtf8 "123", ConstInteger 32]
```

启动语言扩展后可以定义一个类似Java Object的类型Any, 它可以封装任意类型。  
`ExistentialQuantification`使得我们可以在等号的右边定义类型变量。我们称`a`为existential type variable。 
```Haskell
{-# LANGUAGE ExistentialQuantification #-}
```  
```Haskell
data Any = forall a. Any a 
```  
这样我们就可以定义一个异构的列表了。  
```Haskell
entries :: [Any]
entries = [Any $ ConstUtf8 "hello", Any $ ConstInteger 123]
```

虽然我们很容易的定义了`entries`，但是无法从中得到任何信息，因为类型构造器Any中没有包含`a`的任何信息。我们要如何获取Any中的数据呢？

### 解构Any

使用CPS（Continuation Pass Style）解构Any，可以定义如下elimAny方法。注意forall a.的范围。elimAny的完整类型可以写为`elimAny::(forall r. (forall a. (a -> r)) -> Any -> r)`。`r`的范围包含整个表达式，表示`r`的类型是由调用方（caller）决定的；`a`的范围只局限在f函数中，并没有包含在返回值中逃逸出去，表示`a`的类型是由被调方（callee）决定的。因为（Any x）中的x是任意类型，所以调用方不能决定传入的f函数的入参`a`是什么类型，只能由被调方决定。
```Haskell
{-# LANGUAGE RankNTypes #-}
```  
```Haskell
elimAny :: (forall a. (a -> r)) -> Any -> r 
elimAny f (Any x) = f x 
```  

有了elimAny我们就可以定义各种各样的`f`函数，来窥探Any对象的值了。那么什么样的`f`函数可以接受任意的值`a`呢？那当然是可以接受任意值的函数了，比如justHello，输入任意值都会返回Hello。  
```Haskell
justHello :: a -> String 
justHello _ = "Hello"
```  
使用上述entries测试下。It works！
```Haskell
ghci> justHello $ head entries 
"Hello"
```  
那传入一个Int返回Hello的justIntHello可以作为`f`函数吗？
```Haskell
justIntHello :: Int -> String 
justIntHello _ = "Hello"
```  
当然是不行的，因为f的入参不能由调用方限定死，我们没法保证（Any x）里的x就是Int类型。  
```Haskell
<interactive>:38:21: error:
    • Couldn't match type ‘Any’ with ‘Int’
      Expected: [Int]
        Actual: [Any]
    • In the first argument of ‘head’, namely ‘entries’
      In the second argument of ‘($)’, namely ‘head entries’
      In the expression: justIntHello $ head entries
```

### 限定Any的类型
如果只能使用justHello函数，那对于了解对象（Any a）中的数据是意义不大的。我们可以使用type class来限定a的类型， 这样就可以使用更加确切的f函数来应用Any。  
比如为Any增加Show的约束，修改Any和elimAny如下：
```Haskell
data Any = forall a. (Show a) => Any a 

elimAny :: (forall a. (Show a) => (a -> r)) -> Any -> r
elimAny f (Any a) = f a 
```
定义函数showAny。  
```Haskell
showAny :: Any -> String 
showAny = elimAny show  
```  
这样就可以在控制台展示Any的内容。  
```Haskell
ghci> showAny $ head entries 
"ConstUtf8 \"hello\""
ghci> showAny $ last entries 
"ConstInteger 123"
```

### Dynamic Type (Again)

在前面的展示中，我们使用toDyn和fromDynamic函数，定义了一个通用的函数来解构CPEntry中的常量项。
```Haskell
toDyn :: Typeable a => a -> Dynamic
fromDynamic :: forall a. Typeable a => Dynamic -> Maybe a     
```  
这两个函数都只需要一个Typeable的约束，就可以实现类型的转化。那我们能够给（Any a）的a加上Typeable的约束，以便随后将a转化为任意类型？  
再次修改Any和elimAny如下：
```Haskell
data Any = forall a. (Show a, Typeable a) => Any a 

elimAny :: (forall a. (Show a, Typeable a) => (a -> r)) -> Any -> r
elimAny f (Any a) = f a 
```  
如同showAny定义castAny。  
```Haskell
castAny :: (Typeable a) => Any -> Maybe a 
castAny  = elimAny cast
```
测试下castAny。 
```Haskell
ghci> castAny $ head entries :: Maybe ConstUtf8 
Just (ConstUtf8 "hello")
ghci> castAny $ last entries :: Maybe ConstInteger
Just (ConstInteger 123)
ghci> castAny $ last entries :: Maybe ConstUtf8 
Nothing
```

### 利用class类型定义常量池的接口
Haskell的class是可以继承的，我们可以定义一个ICPEntry class，以及与之对应CPEntryAny。所有实现了ICPEntry的常量项，都可以构造成一个CPEntryAny对象。而任意一个CPEntryAny对象即可以自由的使用ICPEntry中的所有方法，又可以通过castAny转为特定的常量项。例如：  
```Haskell
class (Typeable a, HasCPEntryTag a ) => HasCPEntry a
instance HasCPEntry ConstUtf8
instance HasCPEntry ConstInteger

class HasCPEntryTag a where 
    cpEntryTag :: a -> CPTag
instance HasCPEntryTag ConstUtf8 where 
  cpEntryTag _ = JVM_Constant_Utf8
instance HasCPEntryTag ConstInteger where
  cpEntryTag _ = JVM_Constant_Integer  

data CPAny = forall a. (HasCPEntry a) => CPAny a 

elimCPAny :: (forall a. (HasCPEntry a) => (a -> r)) -> CPAny -> r
elimCPAny f (CPAny a) = f a 

castCPAny :: (Typeable a) => CPAny -> Maybe a 
castCPAny  = elimCPAny cast

tagCPAny :: CPAny -> CPTag
tagCPAny = elimCPAny cpEntryTag
```

此时的CPAny隐藏了具体的常量项实现，只提供了操作这些常量项的接口，是否为一种抽象数据类型？

### 模式匹配呢？
我们定义了CPAny，也通过class ICPEntry定义了它的接口。但如果我想简单的在一个函数里处理下CPAny，又不想在ICPEntry中增加接口，该怎么办呢？简单而言，能否通过pattern matching的方式解构CPAny？  
既然CPAny有ICPEntry的约束，而实现ICPEntry的类型只有ConstUtf8和ConstInteger，所以尝试如下：  
```Haskell
-- error
adhocCPAny :: CPAny -> String 
adhocCPAny (CPAny (ConstUtf8 _)) = "U8"
adhocCPAny (CPAny (ConstInteger _)) = "Int"
```
以上代码会报错，提示类型不匹配。所以，再增加一点点改变...

# Existential Types with GADTS(Another way again...)

## 使用GADTs表示常量项
