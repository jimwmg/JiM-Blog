---
title:shell操作符
---

## 算术运算符Arithmetic Operators

The following arithmetic operators are supported by Bourne Shell.

Assume variable **a** holds 10 and variable **b** holds 20 then −

[Show Examples](https://www.tutorialspoint.com/unix/unix-arithmetic-operators.htm)

|      Operator      |                         Description                          |                Example                |
| :----------------: | :----------------------------------------------------------: | :-----------------------------------: |
|    + (Addition)    |          Adds values on either side of the operator          |      `expr $a + $b` will give 30      |
|  - (Subtraction)   |     Subtracts right hand operand from left hand operand      |     `expr $a - $b` will give -10      |
| * (Multiplication) |       Multiplies values on either side of the operator       |     `expr $a \* $b` will give 200     |
|    / (Division)    |       Divides left hand operand by right hand operand        |      `expr $b / $a` will give 2       |
|    % (Modulus)     | Divides left hand operand by right hand operand and returns remainder |      `expr $b % $a` will give 0       |
|   = (Assignment)   |            Assigns right operand in left operand             | a = $b would assign value of b into a |
|   == (Equality)    |  Compares two numbers, if both are same then returns true.   |   [ $a == $b ] would return false.    |
| != (Not Equality)  | Compares two numbers, if both are different then returns true. |    [ $a != $b ] would return true.    |

It is very important to understand that all the conditional expressions should be inside square braces with spaces around them, for example **[ $a == $b ]** is correct whereas, **[$a==$b]** is incorrect.

All the arithmetical calculations are done using long integers.

## 关系运算符 Relational Operators

Bourne Shell supports the following relational operators that are specific to numeric values. These operators do not work for string values unless their value is numeric.

For example, following operators will work to check a relation between 10 and 20 as well as in between "10" and "20" but not in between "ten" and "twenty".

Assume variable **a** holds 10 and variable **b** holds 20 then −

[Show Examples](https://www.tutorialspoint.com/unix/unix-relational-operators.htm)

| Operator |                         Description                          |          Example           |
| :------: | :----------------------------------------------------------: | :------------------------: |
| **-eq**  | Checks if the value of two operands are equal or not; if yes, then the condition becomes true. | [ $a -eq $b ] is not true. |
| **-ne**  | Checks if the value of two operands are equal or not; if values are not equal, then the condition becomes true. |   [ $a -ne $b ] is true.   |
| **-gt**  | Checks if the value of left operand is greater than the value of right operand; if yes, then the condition becomes true. | [ $a -gt $b ] is not true. |
| **-lt**  | Checks if the value of left operand is less than the value of right operand; if yes, then the condition becomes true. |   [ $a -lt $b ] is true.   |
| **-ge**  | Checks if the value of left operand is greater than or equal to the value of right operand; if yes, then the condition becomes true. | [ $a -ge $b ] is not true. |
| **-le**  | Checks if the value of left operand is less than or equal to the value of right operand; if yes, then the condition becomes true. |   [ $a -le $b ] is true.   |

It is very important to understand that all the conditional expressions should be placed inside square braces with spaces around them. For example, **[ $a <= $b ]** is correct whereas, **[$a <= $b]** is incorrect.

## 布尔运算符 Boolean Operators

The following Boolean operators are supported by the Bourne Shell.

Assume variable **a** holds 10 and variable **b** holds 20 then −

[Show Examples](https://www.tutorialspoint.com/unix/unix-boolean-operators.htm)

| Operator |                         Description                          |                Example                |
| :------: | :----------------------------------------------------------: | :-----------------------------------: |
|  **!**   | This is logical negation. This inverts a true condition into false and vice versa. |         [ ! false ] is true.          |
|  **-o**  | This is logical **OR**. If one of the operands is true, then the condition becomes true. | [ $a -lt 20 -o $b -gt 100 ] is true.  |
|  **-a**  | This is logical **AND**. If both the operands are true, then the condition becomes true otherwise false. | [ $a -lt 20 -a $b -gt 100 ] is false. |

## 字符串运算符 String Operators

The following string operators are supported by Bourne Shell.

Assume variable **a** holds "abc" and variable **b** holds "efg" then −

[Show Examples](https://www.tutorialspoint.com/unix/unix-string-operators.htm)

| Operator |                         Description                          |         Example          |
| :------: | :----------------------------------------------------------: | :----------------------: |
|  **=**   | Checks if the value of two operands are equal or not; if yes, then the condition becomes true. | [ $a = $b ] is not true. |
|  **!=**  | Checks if the value of two operands are equal or not; if values are not equal then the condition becomes true. |  [ $a != $b ] is true.   |
|  **-z**  | Checks if the given string operand size is zero; if it is zero length, then it returns true. |  [ -z $a ] is not true.  |
|  **-n**  | Checks if the given string operand size is non-zero; if it is nonzero length, then it returns true. | [ -n $a ] is not false.  |
| **str**  | Checks if **str** is not the empty string; if it is empty, then it returns false. |   [ $a ] is not false.   |

## 文件操作符 File Test Operators

We have a few operators that can be used to test various properties associated with a Unix file.

Assume a variable **file** holds an existing file name "test" the size of which is 100 bytes and has **read**, **write** and **execute** permission on −

[Show Examples](https://www.tutorialspoint.com/unix/unix-file-operators.htm)

|  Operator   |                         Description                          |          Example          |
| :---------: | :----------------------------------------------------------: | :-----------------------: |
| **-b file** | Checks if file is a block special file; if yes, then the condition becomes true. |  [ -b $file ] is false.   |
| **-c file** | Checks if file is a character special file; if yes, then the condition becomes true. |  [ -c $file ] is false.   |
| **-d file** | Checks if file is a directory; if yes, then the condition becomes true. | [ -d $file ] is not true. |
| **-f file** | Checks if file is an ordinary file as opposed to a directory or special file; if yes, then the condition becomes true. |   [ -f $file ] is true.   |
| **-g file** | Checks if file has its set group ID (SGID) bit set; if yes, then the condition becomes true. |  [ -g $file ] is false.   |
| **-k file** | Checks if file has its sticky bit set; if yes, then the condition becomes true. |  [ -k $file ] is false.   |
| **-p file** | Checks if file is a named pipe; if yes, then the condition becomes true. |  [ -p $file ] is false.   |
| **-t file** | Checks if file descriptor is open and associated with a terminal; if yes, then the condition becomes true. |  [ -t $file ] is false.   |
| **-u file** | Checks if file has its Set User ID (SUID) bit set; if yes, then the condition becomes true. |  [ -u $file ] is false.   |
| **-r file** | Checks if file is readable; if yes, then the condition becomes true. |   [ -r $file ] is true.   |
| **-w file** | Checks if file is writable; if yes, then the condition becomes true. |   [ -w $file ] is true.   |
| **-x file** | Checks if file is executable; if yes, then the condition becomes true. |   [ -x $file ] is true.   |
| **-s file** | Checks if file has size greater than 0; if yes, then condition becomes true. |   [ -s $file ] is true.   |
| **-e file** | Checks if file exists; is true even if file is a directory but exists. |   [ -e $file ] is true.   |