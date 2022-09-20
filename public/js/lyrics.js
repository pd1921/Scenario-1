var countdown = document.getElementById("test");
var running = false;
function start() {
	if(!running) { 
		countdown.classList.add('ani');
	} else {
		// var computedStyle = window.getComputedStyle(countdown),
		//     marginLeft = computedStyle.getPropertyValue('margin-left');
		// countdown.style.marginLeft = marginLeft;
		countdown.classList.remove('ani');    
	}  
	// var l1 = document.getElementById("l1");
	// var h3=document.createElement("h3");
	// h3.innerHTML = "hello world";
	// l1.appendChild(h3);
	running = !running; 
}