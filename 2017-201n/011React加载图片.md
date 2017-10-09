---
title: React加载图片
date: 2017-07-20
categories: react

---

###嗯，只写代码了 ，不写解释了 

```javascript
class AttachmentPreview extends React.Component{
  constructor(props){
    super(props);
    this.onHandleBack = this.onHandleBack.bind(this);
    this.modelChange = this.modelChange.bind(this);
    this.onImgLoaded = this.onImgLoaded.bind(this);
    this.onImgLoadErr = this.onImgLoadErr.bind(this);
    this.state={
      file:props.location.state.file,
      indicator:'loading',
      modelInfo:'netWork error',
      animating:true,
      modelState:false
    };
  }
  
  onImgLoaded(){
    console.log('图片加载成功')
    this.setState({animating:false})
  }
  onImgLoadErr(){
    this.setState({animating:false,modelState:true})
  }
  onHandleBack() {
    this.props.history.goBack();
  }
  modelChange(){
    this.setState({modelState:false})
  }
  render(){
    const headerH = 88;
    const dpr =window.devicePixelRatio?window.devicePixelRatio:"";
    const imgConH = document.documentElement.clientHeight;
    const screenH = window.screen? window.screen.height : "";
    // debugger;
    console.log('imageCon',imgConH,'dpr',dpr,'screen',screenH);
    const HeaderInfo = {
            title: "附件预览",
            iconLeft: "left",
            iconLeftClick: this.onHandleBack,
            iconRightContent: [
                {
                    rightContent: "下载",
                    rightClick: ()=>{debugger;console.log(this.state.file);downLoadFile(this.state.file)}
                }
            ]
        }
    return (
      <div className='preview'>
        <Header {...HeaderInfo}></Header>
        <div  style={{height:(imgConH-headerH)+"px"}} className='imgCon'>
          <img className='imageSize' 
              src={`${config.target}` + 'getFile?'+`${this.state.file.path}`} 
              onLoad = {this.onImgLoaded}
              onError = {this.onImgLoadErr}
              />
        </div>
        <ActivityIndicator
            toast
            text={this.state.indicator}
            animating={this.state.animating}
        />
        <Modal
            title={this.state.modelInfo}
            transparent
            maskClosable={false}
            visible={this.state.modalState}
            footer={[{ text: '确定', onPress: () => {this.modelChange()} }]}
        >
        </Modal>
      </div>
    )
  }
}
```

基于阿里的antedmobile控件，主要是图片加载成功和失败可以进行一个提示框的显示和隐藏而已，很简单



[参考](http://andrewhfarmer.com/react-image-gallery/)