var canv = document.getElementById("canvas");
    canv.width = 700;
    canv.height = 700;
    canv.strokeStyle = 'rgba(255,255,255,255)';
    var ctx = canv.getContext('2d');
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canv.width, canv.height);
    ctx.strokeStyle = 'rgba(255,255,255,255)';

    let addBut = document.getElementById("addButton");
    let deleteBut = document.getElementById("deleteButton");

    var count = 3;
    var arrDot = [];
    arrWindow = [];

    randomSegments();
    draw();

    function addDot(){

        let newArrWindow = []; 

        if(count < 7){

            count++;

            let table = document.getElementById("table");
            let newDotInput = ('<td><span class="col-sm">X<sub>' + count + '</sub></span></td>');
                newDotInput += '<td><input type="number" style="width: 100%" class="form-control col-sm" name="" id="x' + count + 'Text" min="0" max="700" value="0" onchange="draw(arrDot)"></td>';
                newDotInput += '<td><span class="col-sm">Y<sub>' + count + '</sub></span></td>';
                newDotInput += '<td><input type="number" style="width: 100%" class="form-control col-sm" name="" id="y' + count + 'Text" min="0" max="700" value="0" onchange="draw(arrDot)"></td>';
            table.insertAdjacentHTML('beforeend', newDotInput);

            for(let i = 0; i < count; i++){

                let ptr = document.getElementById("x" + (i + 1) + "Text").value;
                let ptr1 = document.getElementById("y" + (i + 1) + "Text").value;
                newArrWindow.push([ptr, ptr1]);
            }

            arrWindow = newArrWindow;

        }
        else{
            alert("Максимальное количество точек: 7");
        }

    }

    function deleteDot(){
        
        let newArrWindow = []; 

        if(count > 3){
            var trItems = document.getElementById("table").getElementsByTagName("tr");
            trItems[trItems.length-1].remove();
            count--;
        }
        else{
            alert("Минимальное количество точек: 3");
        }
        
        for(let i = 0; i < count; i++){

                let ptr = document.getElementById("x" + (i + 1) + "Text").value;
                let ptr1 = document.getElementById("y" + (i + 1) + "Text").value;
                newArrWindow.push([ptr, ptr1]);
            }

            arrWindow = newArrWindow;

    }

    function randomSegments(){

        let num = getRandomInt(3, 8);

        let newArrDot = [];

        for(let i = 0; i < num; i++){
            let x = getRandomInt(10, 700);
            let y = getRandomInt(10, 700);
            let x1 = getRandomInt(10, 700);
            let y1 = getRandomInt(10, 700);

            let newDotX = [x, x1];
            let newDotY = [y, y1];

            newArrDot.push([newDotX, newDotY]);
        }

        arrDot = newArrDot;
    }

    function draw(){

        ctx.clearRect(0, 0, canv.width, canv.height);
        ctx.fillRect(0, 0, canv.width, canv.height);

        let newArrWindow = []; 
        
        for(let i = 0; i < count; i++){
            let ptr = document.getElementById("x" + (i + 1) + "Text").value;
            let ptr1 = document.getElementById("y" + (i + 1) + "Text").value;
            newArrWindow.push([ptr, ptr1]);
        }

        arrWindow = newArrWindow;

        ctx.strokeStyle = 'rgba(255,255,255,255)';

        for(let i = 0; i < arrDot.length; i++){
            
            if (doesLineCrossTheWindow(arrWindow, arrDot[i])){
                ctx.strokeStyle = 'rgba(40,255,40,40)';
            }
            
            ctx.beginPath();
            ctx.moveTo(arrDot[i][0][0], arrDot[i][0][1]);
            ctx.lineTo(arrDot[i][1][0], arrDot[i][1][1]);
            ctx.stroke();
            ctx.closePath();

            ctx.strokeStyle = 'rgba(255,255,255,255)';

        }
        
        ctx.strokeStyle = 'rgba(300,0,200,150)';

        for(let i = 0; i < count - 1; i++){

            ctx.beginPath();
            ctx.moveTo(arrWindow[i][0], arrWindow[i][1]);

            ctx.lineTo(arrWindow[i+1][0], arrWindow[i+1][1]);
            ctx.stroke();
            ctx.closePath();
        }

        ctx.beginPath();
        ctx.moveTo(arrWindow[arrWindow.length-1][0], arrWindow[arrWindow.length-1][1]);
        ctx.lineTo(arrWindow[0][0], arrWindow[0][1]);
        ctx.stroke();
        ctx.closePath();

    }

    function getRandomInt(min, max) {
        return Math.round(Math.random() * (max - min)) + min;
    }

    function linspace(a, b, n) {
        if (typeof n === "undefined") n = Math.max(Math.round(b - a) + 1, 1);
        if (n < 2) {
            return n === 1 ? [a] : [];
        }
        var i, ret = Array(n);
        n--;
        for (i = n; i >= 0; i--) {
            ret[i] = (i * b + (n - i) * a) / n;
        }
        return ret;
    }
    
    function rotate(A, B, C){
        return (B[0]-A[0])*(C[1]-B[1])-(B[1]-A[1])*(C[0]-B[0]);
    }

    function intersect(A,B,C,D){
        return ( (rotate(A,B,C) * rotate(A,B,D) <= 0) & (rotate(C,D,A) * rotate(C,D,B) < 0) );
    }

    function pointloc(P,A){
        n = P.length;
        if ( rotate(P[0],P[1],A)<0 || rotate(P[0],P[n-1],A)>0 ){
            return false;
        }else{
            return true;
        }
    }
    
    function isDotInTheWindow(P, A){
        if (pointloc(P,A)){
            let p = 1;
            let r = P.length;
            while(r - p > 1){
                q = Math.round((p + r)/2);
                if (rotate(P[0], P[q], A) < 0){
                    r = q;
                }else{
                    p = q;
                }
            }   
            return !intersect(P[0],A,P[p],P[r]);
        }else{
            return false;
        }
    }

    function doesLineCrossTheWindow(P, A){
        let x = isDotInTheWindow(P, A[0]);
        let y = isDotInTheWindow(P, A[1]);
        let boolean = false;
        for (let i = 0; i < P.length - 1; i++){
            if (intersect(A[0], A[1], P[i], P[i+1])){
                boolean = true;
            }
        }
        return x & !y | !x & y | x & y | boolean;
    }
