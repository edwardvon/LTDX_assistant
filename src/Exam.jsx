export const Exam = () =>{
    window.aa = document.querySelector("#in-wrap").__vue__;
    if (aa.Examentity.screenTimes>0){
        aa.Examentity.screenTimes=9999;
    }
    aa.$watch("Examentity",function(){
        aa.Examentity.screenTimes=9999;
    });
    aa.$watch("Examentity.screenTimes",function(){
        aa.Examentity.screenTimes=9999;
    });

}
