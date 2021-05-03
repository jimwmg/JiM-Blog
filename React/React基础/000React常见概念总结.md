---

---

### 1.受控组件  非受控组件

In HTML, form elements such as `<input>`, `<textarea>`, and `<select>` typically maintain their own state and update it based on user input. In React, mutable state is typically kept in the state property of components, and only updated with setState().
In most cases, we recommend using controlled components to implement forms. In a controlled component, form data is handled by a React component. The alternative is uncontrolled components, where form data is handled by the DOM itself.

### 2.派生state 

如果**一个组件的state中的某个数据来自外部**，就将该数据称之为派生状态

