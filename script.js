//this is going to be a little bit different than the guide from the slide as a matter to challenge myself
//apologize if there are any inconveniences

//act as global variable due to multiple access from different functions
const fetchBusID = document.getElementById("busSchedule");
let nIntervId;

//get data from server, if ok, then go to display function
async function fetchBusTime(busID) {

  const response = await fetch(`https://sg-bus-arrivals-sigma-schoolsc1.replit.app/?id=${busID}`);
  if (response.ok) {
    const bus = await response.json();
    //console.log(bus.services);
    displayBusTime(bus.services);
  } else {
    throw new Error("Data does not exist.");
  }
}

//display data on website, if no data, then display error message
function displayBusTime(bus) {
  let message = '';
  // console.log(bus[0].bus_no);
  if (bus) {
    for (const busStop in bus) {
      const busNo = bus[busStop].bus_no;
      let busTime = bus[busStop].next_bus_mins;
      
      if (busTime <= 0) {
        busTime = '<font color="green">Arriving</font>';
      } else {
        busTime = `${bus[busStop].next_bus_mins} min(s)`;
      }
      
      message += `<p>Bus ${busNo}: <b>${busTime}</b></p>`;
    }
  } else {
    message = `<p>Bus Not Found</p>`;
  }

  fetchBusID.innerHTML = message;
}

//function that will be accessed upon clicking the submit button
function handleBusTime(busID) {
  //fetch process begins
  //if error occured, display on both console and web browser
  fetchBusTime(busID).catch((err) => {
    clearInterval(nIntervId);
    nIntervId = null;
    
    fetchBusID.innerHTML = err.message;
    console.error("Error: ", err.message);
  })
}

function getBusTime(){
  const busIDInput = document.getElementById("busStopID");
  const busID = busIDInput.value;
  
  fetchBusID.innerHTML = 'Loading...';
  
  if (!nIntervId) {
    nIntervId = setInterval(function(){ handleBusTime(busID); }, 5000);
  } else{
    clearInterval(nIntervId);
    nIntervId = setInterval(handleBusTime, 5000);
  }
}