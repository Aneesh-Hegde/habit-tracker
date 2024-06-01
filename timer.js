let startButton=document.querySelector('.start');
let finishButton=document.querySelector('.finish');
let hour=document.querySelector('.hour');
let minute=document.querySelector('.minute');
let second=document.querySelector('.seconds');

//initializing essential variable
let timerClock;
let breakClock;
let breakTiming;
//function when break time is over
function clearBreak(){
    clearInterval(breakClock);
    minute.innerHTML='00';
    second.innerHTML='00';
    hour.innerHTML='00';
}
//function to run break time
function breakTime(){
    if(breakTiming>=1){
        let hrsBreak=Math.floor(breakTiming / 3600);
        breakTiming %= 3600; 
        let minBreak=Math.floor(breakTiming / 60);
        let secBreak=breakTiming % 60;
        minute.innerHTML=`${minBreak}`;
        second.innerHTML=`${secBreak}`;
        hour.innerHTML=`${hrsBreak}`;

        breakClock=setInterval(()=>{
            if(parseInt(second.innerHTML)==0 && parseInt(minute.innerHTML)==0 && parseInt(hour.innerHTML)==0) clearBreak();
            else {
                let secondValue=parseInt(second.innerHTML)-1;
                let minuteValue=parseInt(minute.innerHTML);
                let hourValue=parseInt(hour.innerHTML);
                second.innerHTML=secondValue.toString().padStart(2, '0');
                minute.innerHTML=minuteValue.innerHTML=minuteValue.toString().padStart(2, '0');
                hour.innerHTML=hourValue.toString().padStart(2, '0');
                if(secondValue==0 && parseInt(minute.innerHTML)>0){
                    minuteValue-1;
                    minute.innerHTML=minuteValue.innerHTML=minuteValue.toString().padStart(2, '0');
                    second.innerHTML='59';
        
                }
                if(parseInt(minute.innerHTML)==0 && parseInt(hour.innerHTML)>0){
                    hourValue-1;
                    hour.innerHTML=hourValue.toString().padStart(2, '0');
                    minute.innerHTML='59';
                    second.innerHTML='59';
        
                }
            }
        },1000)

        
    }else{
        minute.innerHTML='00';
        second.innerHTML='00';
        hour.innerHTML='00';
    }


    
}

//timer fucntion
function timer(){
    timerClock=setInterval(()=>{
        let secondValue=parseInt(second.innerHTML)+1;
        let minuteValue=parseInt(minute.innerHTML);
        let hourValue=parseInt(hour.innerHTML);
        second.innerHTML=secondValue.toString().padStart(2, '0');
        minute.innerHTML=minuteValue.innerHTML=minuteValue.toString().padStart(2, '0');
        hour.innerHTML=hourValue.toString().padStart(2, '0');
        if(secondValue%60==0){
            minuteValue+1;
            minute.innerHTML=minuteValue.toString().padStart(2, '0');
            second.innerHTML='00';

        }
        if(parseInt(minute.innerHTML)%60==0 && parseInt(minute.innerHTML)>0){
            hourValue+1;
            hour.innerHTML=hourValue.toString().padStart(2, '0');
            minute.innerHTML='00';
            second.innerHTML='00';

        }
    },1000)
}
let secBeforeBreak;
let minBeforeBreak;
let hrsBeforeBreak;
//event to run on clicking start and finish button
startButton.addEventListener("click",()=>{
    if(startButton.innerHTML=='Pause') {
        startButton.innerHTML='Continue';
        clearInterval(timerClock);
        secBeforeBreak=parseInt(second.innerHTML);
        minBeforeBreak=parseInt(minute.innerHTML);
        hrsBeforeBreak=parseInt(hour.innerHTML);
        breakTiming=Math.floor((parseInt(second.innerHTML)+parseInt(minute.innerHTML)*60+parseInt(hour.innerHTML)*3600)/5);
        breakTime();

    }
    else if(startButton.innerHTML=='Continue'){
        minute.innerHTML=`${minBeforeBreak}`;
        second.innerHTML=`${secBeforeBreak}`;
        hour.innerHTML=`${hrsBeforeBreak}`;
        startButton.innerHTML='Pause';
        timer();
    }
    else {
        startButton.innerHTML='Pause';
        minute.innerHTML='00';
        second.innerHTML='00';
        hour.innerHTML='00';
        timer();
    }
});

finishButton.addEventListener('click',()=>{
    if(startButton.innerHTML=='Continue'){
        clearInterval(breakClock);
        console.log(`hour:${hrsBeforeBreak},minute:${minBeforeBreak},second:${secBeforeBreak}`);
    }else{
        console.log(`hour:${hour.innerHTML},minute:${minute.innerHTML},second:${second.innerHTML}`)
        clearInterval(timerClock);
        
    }
    minute.innerHTML='00';
        second.innerHTML='00';
        hour.innerHTML='00';
    
    startButton.innerHTML='Start';
})