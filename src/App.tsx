import React, { useState, useEffect, useMemo } from "react";
import flow from "./flow.json";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import addNotification from "react-push-notification";
import logo from "./logo192.png";
import "./App.css";

const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

function App() {
 //  State Variables
	const [progress, setProgress] = useState(0);
	const [caretakerID, setCaretakerID] = useState("");
	const [patientID, setPatientID] = useState("");
	const [rifaxPres, setRifaxPres] = useState("");
    const [providerNumber, setProviderNumber] = useState("");
	const [maxBM, setMaxBM] = useState("");
	const [idealBM, setIdealBM] = useState("");
	const [alarmMaxBM, setAlarmMaxBM] = useState("");

    const [numBM, setNumBM] = useState("");
    const [numLact, setNumLact] = useState("");
    const [rifaxYN, setRifaxYN] = useState("");
    const [HEyn, setHEyn] = useState("");

    const [numLactCheckOne, setNumLactCheckOne] = useState("");
    const [numBMCheckOne, setNumBMCheckOne] = useState("");
    const [HEynCheckOne, setHEynCheckOne] = useState("");

    const [numLactCheckTwo, setNumLactCheckTwo] = useState("");
    const [numBMCheckTwo, setNumBMCheckTwo] = useState("");
    const [HEynCheckTwo, setHEynCheckTwo] = useState("");

    const [resolvedHEBMNum, setResolvedHEBMNum] = useState("");
   
    const [date, onChangeDate] = useState(new Date());

    const [session, setSession] = useState([{}]);

// React Use Lifecycle Methods
    const fetchPrompt = (() => {
        let question = flow[progress][`question`];

        if (progress === 3 && rifaxPres === 'N' ){
            setProgress(4);
        }

        if (progress === 5 && HEyn === 'Y' && numBM >= alarmMaxBM ){
            question = rifaxYN ==='Y' ? flow[progress][`question_HEyn_Y_Alarm`] : flow[progress][`question_HEyn_Y_Alarm`] + " Please take your doses of rifaximin." ;
            document.getElementById(`next`)?.classList.add(`hidden`);
        } else if (progress === 5 && HEyn === 'Y' && (rifaxYN === 'Y' || rifaxPres === 'Y')) {
            question = flow[progress][`question_HEyn_Y_Additional`];
        } else if (progress === 5 && HEyn === 'N' && numBM >= alarmMaxBM) {
            question = rifaxYN ==='Y' ? flow[progress][`question_HEyn_N_Alarm`] : flow[progress][`question_HEyn_N_Alarm`] + " Please take your doses of rifaximin." ;
            document.getElementById(`next`)?.classList.add(`hidden`);
        } else if (progress === 5 && HEyn === 'N' && numBM < alarmMaxBM) {
            question = flow[progress][`question_HEyn_N`];
            document.getElementById(`next`)?.classList.add(`hidden`);
        } else if (progress === 5 && HEyn === 'Y' && rifaxYN !== 'Y'){
            question = flow[progress][`question_HEyn_Y`];
        }

        if (progress === 9 && HEynCheckOne === 'Y' ){
            question = flow[progress][`question_Y`];
            document.getElementById(`next`)?.classList.add(`hidden`);
        } else if (progress === 9 && HEynCheckOne === 'N') {
            setResolvedHEBMNum(numBMCheckOne);
        }

        if (progress === 13 && HEynCheckTwo === 'Y' ){
            question = flow[progress][`question_Y`];
            document.getElementById(`next`)?.classList.add(`hidden`);
        } else if (progress === 13 && HEynCheckTwo === 'N') {
            setResolvedHEBMNum(numBMCheckTwo);
            document.getElementById(`next`)?.classList.add(`hidden`);
        }

        
        return question?.replaceAll(`[providerNumber]`, providerNumber)
                            .replaceAll(`[maxBM]`, maxBM)
                            .replaceAll(`[idealBM]`, idealBM);
    });
    const memoizedVal = useMemo(() => fetchPrompt(), [progress]);

    useEffect(()=>{
        if (caretakerID !== "" && patientID !== "" && rifaxPres !== "" && providerNumber !== "" && maxBM !== "" && idealBM !== "" && alarmMaxBM !== ""){
            document.getElementById(`questionaire`)?.classList.remove(`hidden`);
        } else {
            document.getElementById(`questionaire`)?.classList.add(`hidden`);
        }
    }, [caretakerID, patientID, rifaxPres, providerNumber, maxBM, idealBM, alarmMaxBM])

// Navigation
	const start = () => {
        let junk = session;
        junk.shift();
        setSession(junk);

		document.getElementById(`adminPanel`)?.classList.remove(`hidden`);
		document.getElementById(`start`)?.classList.add(`hidden`);
        document.getElementById(`patients`)?.classList.remove(`hidden`);
        document.getElementById(`control`)?.classList.add(`hidden`);
        document.getElementById(`prompt`)?.classList.add(`hidden`);
	}

    const newPatient = () => {
        setProgress(0);

		document.getElementById(`adminPanel`)?.classList.remove(`hidden`);
		document.getElementById(`start`)?.classList.add(`hidden`);
        document.getElementById(`patients`)?.classList.remove(`hidden`);
        document.getElementById(`control`)?.classList.add(`hidden`);
	}

    const questionaire = () => {
        setProgress(1)
        setHEyn("");
        setHEynCheckOne("");
        setHEynCheckTwo("");
        setNumBM("");
        setNumBMCheckOne("");
        setNumBMCheckTwo("");
        setNumLact("");
        setNumLactCheckOne("");
        setNumLactCheckTwo("");
        setResolvedHEBMNum("");
        setRifaxYN("");
        onChangeDate(new Date());
        document.getElementById(`prompt`)?.classList.remove(`hidden`);
		document.getElementById(`control`)?.classList.remove(`hidden`);
        document.getElementById(`prev`)?.classList.add(`hidden`);
        document.getElementById(`next`)?.classList.remove(`hidden`);
		document.getElementById(`adminPanel`)?.classList.add(`hidden`);
        document.getElementById(`patientsView`)?.classList.add(`hidden`);
	}

	const prev = () => {
        setProgress(progress - 1);
        onChangeDate(new Date());
        storeSession(false);

        if (progress === 1){
            document.getElementById(`prev`)?.classList.add(`hidden`);
        }

        document.getElementById(`adminPanel`)?.classList.add(`hidden`);
        document.getElementById(`next`)?.classList.remove(`hidden`);
	}

	const next = () => {
        onChangeDate(new Date());
        if (progress  === 4 && HEyn === 'Y' && numBM < alarmMaxBM){
            setProgress(progress + 1);
            storeSession(true);
        } else if (progress === 8) {
            setProgress(progress + 1);
            storeSession(true);
        } else {
            setProgress(progress + 1);
            storeSession(false);
        }

        document.getElementById(`prev`)?.classList.remove(`hidden`);
	}

//  Session state managment   
    const storeSession = (notify:boolean) => {
       let data = Object.fromEntries(new FormData(document.querySelector('form')).entries())
       let uni = Date.now();

        let tmp = { "unique": uni,
                    "caretakerID": data.caretakerID, 
                    "patientID": data.patientID, 
                    "progress": notify ? (Number(data.progress) + 1) : data.progress, 
                    "date": data.date,                    
                    "time": data.time,
                    "rifaxPres": data.rifaxPres,
                    "providerNumber": data.providerNumber,
                    "maxBM": data.maxBM,
                    "idealBM": data.idealBM,
                    "alarmMaxBM": data.alarmMaxBM,
                    "numBM": data.numBM,
                    "numLact": data.numLact,
                    "rifaxYN": data.rifaxYN,
                    "HEyn": data.HEyn,
                    "numLactCheckOne": data.numLactCheckOne,
                    "numBMCheckOne": data.numBMCheckOne,
                    "HEynCheckOne": data.HEynCheckOne,
                    "numLactCheckTwo": data.numLactCheckTwo,
                    "numBMCheckTwo": data.numBMCheckTwo,
                    "HEynCheckTwo": data.HEynCheckTwo,
                    "resolvedHEBMNum": data.resolvedHEBMNum };
       ;

        let shift = session;
        let lastShift = shift.pop();
        if (lastShift !== undefined 
            && ( lastShift[`caretakerID`] !== tmp[`caretakerID`]  || lastShift[`patientID`] !== tmp[`patientID`] )) {
                shift.push(lastShift);
        }

        shift.push(tmp);
        setSession(shift);

        if (notify) {
            document.getElementById(`next`)?.classList.add(`hidden`);
            setTimeout(() => {         
                addNotification({
                    title: `Patient` + patientID + ` is due for a check in!`,
                    message: 'Last session progress Stage ' + progress ,
                    duration: 10000,
                    icon: `logo192.png`,
                    native: true,
                    onClick: () => load(uni)
                });
                document.getElementById(`next`)?.classList.remove(`hidden`);
            }, 7200000);
        }
    }

//  Page DOM Manipulators
	const admin = () => { document.getElementById(`adminPanel`)?.classList.toggle(`hidden`); }

    const patients = () => {
        document.getElementById(`patientsView`)?.classList.toggle(`hidden`);
	}

    const loadHandler = (e) => {
        let patientUni = e.target.id;
        load(patientUni);
    }

    const load = (id) => {
        document.getElementById(`next`)?.classList.remove(`hidden`);
        document.getElementById(`prev`)?.classList.remove(`hidden`);
        document.getElementById(`prompt`)?.classList.remove(`hidden`);
        document.getElementById(`patientsView`)?.classList.add(`hidden`);

        var result = session.find(obj => obj[`unique`] == id)

        setProgress( Number(result[`progress`]));
        setAlarmMaxBM(result[`alarmMaxBM`]);
        setCaretakerID(result[`caretakerID`]);
        setHEyn(result[`HEyn`]);
        setHEynCheckOne(result[`HEynCheckOne`]);
        setHEynCheckTwo(result[`HEynCheckTwo`]);
        setIdealBM(result[`idealBM`]);
        setMaxBM(result[`maxBM`]);
        setNumBM(result[`numBM`]);
        setNumBMCheckOne(result[`numBMCheckOne`]);
        setNumBMCheckTwo(result[`numBMCheckTwo`]);
        setNumLact(result[`numLact`]);
        setNumLactCheckOne(result[`numLactCheckOne`]);
        setNumLactCheckTwo(result[`numLactCheckTwo`]);
        setPatientID(result[`patientID`]);
        setProviderNumber(result[`providerNumber`]);
        setResolvedHEBMNum(result[`resolvedHEBMNum`]);
        setRifaxPres(result[`rifaxPres`]);
        setRifaxYN(result[`rifaxYN`]);
    }

    const phoneFormat = (input) => { //returns (###) ###-####
        input = input.replace(/\D/g,'');
        var size = input.length;
        if (size>0) {input="("+input}
        if (size>3) {input=input.slice(0,4)+") "+input.slice(4,11)}
        if (size>6) {input=input.slice(0,9)+"-" +input.slice(9)}
        return input; 
    }

    var startDate = "PoopData Session For " + date.getDate() + "/"
        + (date.getMonth() + 1)  + "/" 
        + date.getFullYear() ;

    var startTime = " @ " 
        + (date.getHours() < 10 ? '0' : '') + date.getHours() + ":"  
        + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();

    var patientsList = session.reverse().map(function(el){
                    return <div onClick={loadHandler} id={el['unique']} className="App-link">{el['caretakerID'] + " for " + el['patientID'] + " Stage " + el['progress'] + el[`time`]}</div>;
                    });
                    
	return (
		<div className="App">
			<ThemeProvider theme={ darkTheme }>
				<CssBaseline />

				<form className="App-header">
					<img src={`logo192.png`} srcSet={ logo } alt={`poop-logo`} onClick={ admin } loading="lazy" />
                    <input className="hidden" id="date" name="date" value={ startDate }/>
                    <input className="hidden" id="time" name="time" value={ startTime }/>
                    <input className="hidden" id="progress" name="progress" value={ progress }/>
					<p className="card">Poop PWA - Stage { progress }</p>

					<div id="prompt" className="questions card">{ memoizedVal || '' }</div>

                    <TextField 
                        id="numBm" 
                        name="numBM" 
                        label="Number" 
                        inputProps={{ className: `${ progress === 1 ? "" : "hidden" }`,
                                        inputMode: `numeric` }} 
                        variant="filled" 
                        value={ numBM || ''}  
                        onChange={(e) => setNumBM(e.target.value)}
                        />
                    <TextField 
                        id="numLact" 
                        name="numLact" 
                        label="Number" 
                        inputProps={{ className: `${ progress === 2 ? "" : "hidden" }`,
                                        inputMode: `numeric` }} 
                        variant="filled" 
                        value={ numLact || ''}  
                        onChange={(e) => setNumLact(e.target.value)}
                        />
                    <TextField 
                        id="rifaxYN" 
                        name="rifaxYN" 
                        label="Y/N" 
                        inputProps={{ className: `${progress === 3 ? "" : "hidden" }` }} 
                        variant="filled" 
                        value={rifaxYN || ''}  
                        onChange={(e) => e.target.value.toUpperCase() ==='Y' || e.target.value.toUpperCase() ==='N' ? setRifaxYN(e.target.value.toUpperCase()) : setRifaxYN('')} 
                        />
                    <TextField 
                        id="HEyn" 
                        name="HEyn" 
                        label="Y/N" 
                        inputProps={{ className: `${ progress === 4 ? "" : "hidden" }` }} 
                        variant="filled" 
                        value={ HEyn || ''}  
                        onChange={(e) => e.target.value.toUpperCase() ==='Y' || e.target.value.toUpperCase() ==='N' ? setHEyn(e.target.value.toUpperCase()) : setHEyn('')} 
                        />
                    <TextField 
                        id="numLactCheckOne" 
                        name="numLactCheckOne" 
                        label="Number" 
                        inputProps={{ className: `${ progress === 6 ? "" : "hidden" }`,
                                        inputMode: `numeric` }} 
                        variant="filled" 
                        value={ numLactCheckOne || ''}  
                        onChange={(e) => setNumLactCheckOne(e.target.value)}
                        />
                    <TextField 
                        id="numBMCheckOne" 
                        name="numBMCheckOne" 
                        label="Number" 
                        inputProps={{ className: `${ progress === 7 ? "" : "hidden" }`,
                                        inputMode: `numeric` }} 
                        variant="filled"
                        value={ numBMCheckOne || '' }  
                        onChange={(e) => setNumBMCheckOne(e.target.value)} 
                        />
                    <TextField 
                        id="HEynCheckOne"
                        name="HEynCheckOne" 
                        label="Y/N" 
                        inputProps={{ className: `${ progress === 8 ? "" : "hidden" }` }} 
                        variant="filled" 
                        value={ HEynCheckOne || ''}  
                        onChange={(e) => e.target.value.toUpperCase() ==='Y' || e.target.value.toUpperCase() ==='N' ? setHEynCheckOne(e.target.value.toUpperCase()) : setHEynCheckOne('')} 
                        />
                    <TextField 
                        id="resolvedHEBMNum"
                        name="resolvedHEBMNum" 
                        label="Number" 
                        disabled
                        inputProps={{ className: `${ progress === 9 ? "hidden" : "hidden" }`,
                                        inputMode: `numeric` }} 
                        variant="filled" 
                        value={ resolvedHEBMNum || '' }  
                        onChange={(e) => setResolvedHEBMNum(e.target.value)}
                        />
                    <TextField 
                        id="HEynCheckOne"
                        name="HEynCheckOne" 
                        label="Number" 
                        inputProps={{ className: `${ progress === 9 ? "hidden" : "hidden" }` }} 
                        variant="filled" 
                        value={ HEynCheckOne || '' }  
                        onChange={(e) => e.target.value.toUpperCase() ==='Y' || e.target.value.toUpperCase() ==='N' ? setHEynCheckOne(e.target.value.toUpperCase()) : setHEynCheckOne('')} 
                        />
                    <TextField 
                        id="numLactCheckTwo" 
                        name="numLactCheckTwo" 
                        label="Number" 
                        inputProps={{ className: `${ progress === 10 ? "" : "hidden" }` }} 
                        variant="filled"
                        value={ numLactCheckTwo || '' }  
                        onChange={(e) => setNumLactCheckTwo(e.target.value) } 
                        />
                    <TextField 
                        id="numBMCheckTwo" 
                        name="numBMCheckTwo" 
                        label="Number" 
                        inputProps={{ className: `${ progress === 11 ? "" : "hidden" }`,
                                        inputMode: `numeric` }} 
                        variant="filled" 
                        value={numBMCheckTwo || '' }  
                        onChange={(e) => setNumBMCheckTwo(e.target.value)}
                        />
                    <TextField 
                        id="HEynCheckTwo"
                        name="HEynCheckTwo" 
                        label="Number" 
                        inputProps={{ className: `${ progress === 12 ? "" : "hidden" }` }} 
                        variant="filled" 
                        value={ HEynCheckTwo || '' }  
                        onChange={(e) => e.target.value.toUpperCase() ==='Y' || e.target.value.toUpperCase() ==='N' ? setHEynCheckTwo(e.target.value.toUpperCase()) : setHEynCheckTwo('')} 
                        />
                    <TextField 
                        id="resolvedHEBMNum" 
                        name="resolvedHEBMNum" 
                        label="Number" 
                        disabled
                        inputProps={{ className: `${ HEynCheckTwo === 'Y' && progress === 13 ? "" : "hidden" }` ,
                                        inputMode: `numeric` }} 
                        variant="filled"
                        value={ resolvedHEBMNum || '' }  
                        onChange={(e) => setResolvedHEBMNum(e.target.value)}
                        />

					<div id="adminPanel" className="hidden card">
                        <h5>Enter your CaretakerID and Patient Info.</h5>
                        <Grid container className="livv" direction={"column"} spacing={5}>
                            <Grid item >
                                <TextField 
                                    id="caretakerID" 
                                    name="caretakerID" 
                                    label="caretakerID" 
                                    variant="outlined" 
                                    value={ caretakerID || '' } 
                                    onChange={(e) => setCaretakerID(e.target.value.toUpperCase())}
                                    />
                                <TextField 
                                    id="patientID" 
                                    name="patientID" 
                                    label="patientID" 
                                    variant="outlined"
                                    value={ patientID || '' } 
                                    onChange={(e) => setPatientID(e.target.value.toUpperCase())}
                                    />
                            </Grid>
                            <Grid item>
                                <TextField 
                                    id="rifaxPres" 
                                    name="rifaxPres" 
                                    label="rifaxPres" 
                                    variant="outlined" 
                                    value={ rifaxPres || '' } 
                                    onChange={(e) => e.target.value.toUpperCase() ==='Y' || e.target.value.toUpperCase() ==='N' ? setRifaxPres(e.target.value.toUpperCase()) : setRifaxPres('')} 
                                    />
                                <TextField 
                                    id="providerNumber" 
                                    name="providerNumber" 
                                    label="providerNumber" 
                                    inputProps={{ inputMode: `numeric` }} 
                                    variant="outlined" 
                                    value={ providerNumber || '' } 
                                    onChange={(e) => setProviderNumber(phoneFormat(e.target.value))}
                                    />
                            </Grid>
                            <Grid item>
                                <TextField 
                                    id="maxBM" 
                                    name="maxBM" 
                                    label="maxBM" 
                                    inputProps={{ inputMode: `numeric` }} 
                                    variant="outlined" 
                                    value={ maxBM || '' }  
                                    onChange={(e) => setMaxBM(e.target.value)} 
                                    />
                                <TextField 
                                    id="idealBM" 
                                    name="idealBM" 
                                    label="idealBM" 
                                    inputProps={{ inputMode: `numeric` }} 
                                    variant="outlined" 
                                    value={ idealBM || '' } 
                                    onChange={(e) => setIdealBM(e.target.value)} 
                                    />
                                <TextField 
                                    id="alarmMaxBM" 
                                    name="alarmMaxBM" 
                                    label="alarmMaxBM"
                                    inputProps={{ inputMode: `numeric` }}  
                                    variant="outlined" 
                                    value={ alarmMaxBM || '' } 
                                    onChange={(e) => setAlarmMaxBM(e.target.value)}
                                    />
                            </Grid>
                        </Grid>
                        <Button id="questionaire" variant="outlined" className="hidden" color="success" onClick={ questionaire }>Continue</Button>
					</div>

                    <div id="patientsView" className="card hidden">
                        <div>{ startDate }</div>
                        { progress !== 0 &&  <div>{ patientsList } </div> }
                    </div>
      

					<ButtonGroup id="control" variant="outlined" className="response hidden" aria-label="outlined button group">
						<Button id="prev" color="error" onClick={ prev }>Previous</Button>
						<Button id="next" color="success" onClick={ next }>Next</Button>
					</ButtonGroup>
                    
                    <Button id="start" className="start" variant="contained" onClick={start}>Start</Button>

					<ButtonGroup id="navigation" variant="outlined" className="response" aria-label="outlined button group">
                        <Button id="patients" className="start hidden" variant="contained" onClick={ patients }>Current Patient - { patientID || ''}</Button>
                        {progress !== 0 && <Button 
                                                id="download" 
                                                className="start" 
                                                variant="contained" 
                                                href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(Object.fromEntries(new FormData(document.querySelector('form')).entries())))}`} 
                                                download={`poopData ${ patientID || ''} ${Date.now()}.json`}
                                                > Download { patientID || ''} Report </Button>}
                        {progress !== 0 && <Button id="newPatient" className="start" variant="contained" onClick={ newPatient }>New Patient</Button>}
                    </ButtonGroup>
				</form>
			</ThemeProvider>
		</div>
	);
}

export default App;
