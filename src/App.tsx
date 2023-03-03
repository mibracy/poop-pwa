import React, { useState, useEffect, useMemo } from "react";
import flow from "./flow.json";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Calendar from 'react-calendar';
import "./App.css";

const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

function App() {
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

      const fetchPrompt = ((progress) => {
            let question = flow[progress][`question`];
            console.log(question);

            if (progress == 3 && rifaxPres === 'N' ){
                setProgress(4);
            }

            if (progress == 5 && HEyn === 'Y' && numBM >= alarmMaxBM ){
                question = rifaxYN ==='Y' ? flow[progress][`question_HEyn_Y_Alarm`] : flow[progress][`question_HEyn_Y_Alarm`] + " Please take your doses of rifaximin." ;
                document.getElementById(`next`)?.classList.add(`hidden`);
                document.getElementById(`download`)?.classList.remove(`hidden`);
            } else if (progress == 5 && HEyn === 'Y' && (rifaxYN === 'Y' || rifaxPres === 'Y')) {
                question = flow[progress][`question_HEyn_Y_Additional`];
            } else if (progress == 5 && HEyn === 'N' && numBM >= alarmMaxBM) {
                question = rifaxYN ==='Y' ? flow[progress][`question_HEyn_N_Alarm`] : flow[progress][`question_HEyn_N_Alarm`] + " Please take your doses of rifaximin." ;
                document.getElementById(`next`)?.classList.add(`hidden`);
                document.getElementById(`download`)?.classList.remove(`hidden`);
            } else if (progress == 5 && HEyn === 'N' && numBM < alarmMaxBM) {
                question = flow[progress][`question_HEyn_N`];
                document.getElementById(`next`)?.classList.add(`hidden`);
                document.getElementById(`download`)?.classList.remove(`hidden`);
            } else if (progress == 5 && HEyn === 'Y' && rifaxYN === 'N'){
                question = flow[progress][`question_HEyn_Y`];
            }

            if (progress == 9 && HEynCheckOne === 'Y' ){
                question = flow[progress][`question_Y`];
                document.getElementById(`next`)?.classList.add(`hidden`);
                document.getElementById(`download`)?.classList.remove(`hidden`);
            } else if (progress == 9 && HEynCheckOne === 'N') {
                question = flow[progress][`question_N`];
            }

            if (progress == 13 && HEynCheckOne === 'Y' ){
                question = flow[progress][`question_Y`];
                document.getElementById(`download`)?.classList.remove(`hidden`);
            }

            console.log(question);

            return question?.replaceAll(`[providerNumber]`, providerNumber)
                            .replaceAll(`[maxBM]`, maxBM)
                            .replaceAll(`[idealBM]`, idealBM);
          });
    const memoizedVal = useMemo(() => fetchPrompt(progress), [progress]);

    useEffect(()=>{
        if (caretakerID !== "" && patientID !== "" && rifaxPres !== "" && providerNumber !== "" && maxBM !== "" && idealBM !== "" && alarmMaxBM !== ""){
            document.getElementById(`questionaire`)?.classList.remove(`hidden`);
            document.getElementById(`prompt`)?.classList.add(`hidden`);
        } else {
            document.getElementById(`questionaire`)?.classList.add(`hidden`);
        }
    }, [caretakerID, patientID, rifaxPres, providerNumber, maxBM, idealBM, alarmMaxBM])

	const start = () => {
		document.getElementById(`adminPanel`)?.classList.remove(`hidden`);
		document.getElementById(`start`)?.classList.add(`hidden`);
        document.getElementById(`prompt`)?.classList.add(`hidden`);
	}

    const calender = () => {
        document.getElementById(`calendarView`)?.classList.toggle(`hidden`);
	}


    const questionaire = () => {
        document.getElementById(`prompt`)?.classList.remove(`hidden`);
		document.getElementById(`control`)?.classList.remove(`hidden`);
		document.getElementById(`adminPanel`)?.classList.add(`hidden`);
        setProgress(progress + 1)
	}

	const prev = () => {
        setProgress(progress - 1)
        document.getElementById(`adminPanel`)?.classList.add(`hidden`);
        document.getElementById(`download`)?.classList.add(`hidden`);
        document.getElementById(`next`)?.classList.remove(`hidden`);

         if (progress == 1){
            document.getElementById(`prev`)?.classList.add(`hidden`);
       }
	}

	const next = () => {
        if (progress==13){
            document.getElementById(`next`)?.classList.add(`hidden`);
            return;
        }

        setProgress(progress + 1);
        document.getElementById(`prev`)?.classList.remove(`hidden`);
	}
    
	const admin = () => { document.getElementById(`adminPanel`)?.classList.toggle(`hidden`); }

    var datetime = "PoopData for " + date.getDate() + "/"
        + (date.getMonth()+1)  + "/" 
        + date.getFullYear() + " @ "  
        + date.getHours() + ":"  
        + date.getMinutes() + ":" 
        + date.getSeconds();

	return (
		<div className="App">
			<ThemeProvider theme={darkTheme}>
				<CssBaseline />

				<form className="App-header">
					<img src={`logo192.png`} srcSet={`logo192.png`} alt={`poop-logo`} onClick={admin} loading="lazy" />
                    <input className="hidden" id="date" name="date" value={datetime}/>
					<p className="card">Poop PWA - Stage {progress}</p>

					<div id="prompt" className="questions card">{memoizedVal}</div>

                    <TextField 
                        id="numBm" 
                        name="numBM" 
                        label="Bowel Movements (Number)" 
                        inputProps={{ className: `${progress === 1 ? "" : "hidden"}` }} 
                        variant="filled" 
                        value={numBM}  
                        onChange={(e) => setNumBM(e.target.value)}
                        />
                    <TextField 
                        id="numLact" 
                        name="numLact" 
                        label="Laculose (Number)" 
                        inputProps={{ className: `${progress === 2 ? "" : "hidden"}` }} 
                        variant="filled" 
                        value={numLact}  
                        onChange={(e) => setNumLact(e.target.value)}
                        />
                    <TextField 
                        id="rifaxYN" 
                        name="rifaxYN" 
                        label="rifax (Y/N)" 
                        inputProps={{ className: `${progress === 3 ? "" : "hidden"}` }} 
                        variant="filled" 
                        value={rifaxYN}  
                        onChange={(e) => e.target.value.toUpperCase() ==='Y' || e.target.value.toUpperCase() ==='N' ? setRifaxYN(e.target.value.toUpperCase()) : setRifaxYN('')} 
                        />
                    <TextField 
                        id="HEyn" 
                        name="HEyn" 
                        label="HE (Y/N)" 
                        inputProps={{ className: `${progress === 4 ? "" : "hidden"}` }} 
                        variant="filled" 
                        value={HEyn}  
                        onChange={(e) => e.target.value.toUpperCase() ==='Y' || e.target.value.toUpperCase() ==='N' ? setHEyn(e.target.value.toUpperCase()) : setHEyn('')} 
                        />
                    <TextField 
                        id="numLactCheckOne" 
                        name="numLactCheckOne" 
                        label="Laculose (Number)" 
                        inputProps={{ className: `${progress === 6 ? "" : "hidden"}` }} 
                        variant="filled" 
                        value={numLactCheckOne}  
                        onChange={(e) => setNumLactCheckOne(e.target.value)}
                        />
                    <TextField 
                        id="numBMCheckOne" 
                        name="numBMCheckOne" 
                        label="Bowel Movements (Number)" 
                        inputProps={{ className: `${progress === 7 ? "" : "hidden"}` }} 
                        variant="filled"
                        value={numBMCheckOne}  
                        onChange={(e) => setNumBMCheckOne(e.target.value)} 
                        />
                    <TextField 
                        id="HEynCheckOne"
                        name="HEynCheckOne" 
                        label="HE (Y/N)" 
                        inputProps={{ className: `${progress === 8 ? "" : "hidden"}` }} 
                        variant="filled" 
                        value={HEynCheckOne}  
                        onChange={(e) => e.target.value.toUpperCase() ==='Y' || e.target.value.toUpperCase() ==='N' ? setHEynCheckOne(e.target.value.toUpperCase()) : setHEynCheckOne('')} 
                        />
                    <TextField 
                        id="resolvedHEBMNum"
                        name="resolvedHEBMNum" 
                        label="Laculose (Number)" 
                        inputProps={{ className: `${progress === 9 ? "" : "hidden"}` }} 
                        variant="filled" 
                        value={resolvedHEBMNum}  
                        onChange={(e) => setResolvedHEBMNum(e.target.value)}
                        />
                    <TextField 
                        id="HEynCheckOne"
                        name="HEynCheckOne" 
                        label="Laculose (Number)" 
                        inputProps={{ className: `${progress === 9 ? "" : "hidden"}` }} 
                        variant="filled" 
                        value={HEynCheckOne}  
                        onChange={(e) => e.target.value.toUpperCase() ==='Y' || e.target.value.toUpperCase() ==='N' ? setHEynCheckOne(e.target.value.toUpperCase()) : setHEynCheckOne('')} 
                        />
                    <TextField 
                        id="numLactCheckTwo" 
                        name="numLactCheckTwo" 
                        label="HE (Y/N)" 
                        inputProps={{ className: `${progress === 10 ? "" : "hidden"}` }} 
                        variant="filled"
                        value={numLactCheckTwo}  
                        onChange={(e) =>  setNumLactCheckTwo(e.target.value) } 
                        />
                    <TextField 
                        id="numBMCheckTwo" 
                        name="numBMCheckTwo" 
                        label="Bowel Movements (Number)" 
                        inputProps={{ className: `${progress === 12 ? "" : "hidden"}` }} 
                        variant="filled" 
                        value={numBMCheckTwo}  
                        onChange={(e) => setNumBMCheckTwo(e.target.value)}
                        />
                    <TextField 
                        id="HEynCheckTwo"
                        name="HEynCheckTwo" 
                        label="Laculose (Number)" 
                        inputProps={{ className: `${progress === 12 ? "" : "hidden"}` }} 
                        variant="filled" 
                        value={HEynCheckTwo}  
                        onChange={(e) => e.target.value.toUpperCase() ==='Y' || e.target.value.toUpperCase() ==='N' ? setHEynCheckTwo(e.target.value.toUpperCase()) : setHEynCheckTwo('')} 
                        />
                    <TextField 
                        id="resolvedHEBMNum" 
                        name="resolvedHEBMNum" 
                        label="Resolved HEBM (Number)" 
                        disabled
                        inputProps={{ className: `${HEynCheckTwo == 'Y' && progress === 13 ? "" : "hidden"}` }} 
                        variant="filled"
                        value={resolvedHEBMNum}  
                        onChange={(e) => setResolvedHEBMNum(e.target.value)} 
                        />

					<Card id="adminPanel" className="hidden">
                        <h5>Enter your CaretakerID and Patient Info.</h5>
                        <Grid container direction={"column"} spacing={5}>
                            <Grid item >
                                <TextField 
                                    id="caretakerID" 
                                    name="caretakerID" 
                                    label="caretakerID" 
                                    variant="outlined" 
                                    value={caretakerID} 
                                    onChange={(e) => setCaretakerID(e.target.value.toUpperCase())}
                                    />
                                <TextField 
                                    id="patientID" 
                                    name="patientID" 
                                    label="patientID" 
                                    variant="outlined"
                                    value={patientID} 
                                    onChange={(e) => setPatientID(e.target.value.toUpperCase())}
                                    />
                            </Grid>
                            <Grid item>
                                <TextField 
                                    id="rifaxPres" 
                                    name="rifaxPres" 
                                    label="rifaxPres" 
                                    variant="outlined" 
                                    value={rifaxPres} 
                                    onChange={(e) => e.target.value.toUpperCase() ==='Y' || e.target.value.toUpperCase() ==='N' ? setRifaxPres(e.target.value.toUpperCase()) : setRifaxPres('')} 
                                    />
                                <TextField 
                                    id="providerNumber" 
                                    name="providerNumber" 
                                    label="providerNumber" 
                                    variant="outlined" 
                                    value={providerNumber} 
                                    onChange={(e) => setProviderNumber(e.target.value)}
                                    />
                            </Grid>
                            <Grid item>
                                <TextField 
                                    id="maxBM" 
                                    name="maxBM" 
                                    label="maxBM" 
                                    variant="outlined" 
                                    value={maxBM}  
                                    onChange={(e) => setMaxBM(e.target.value)} 
                                    />
                                <TextField 
                                    id="idealBM" 
                                    name="idealBM" 
                                    label="idealBM" 
                                    variant="outlined" 
                                    value={idealBM} 
                                    onChange={(e) => setIdealBM(e.target.value)} 
                                    />
                                <TextField 
                                    id="alarmMaxBM" 
                                    name="alarmMaxBM" 
                                    label="alarmMaxBM" 
                                    variant="outlined" 
                                    value={alarmMaxBM} 
                                    onChange={(e) => setAlarmMaxBM(e.target.value)}
                                    />
                            </Grid>
                        </Grid>
                        <ButtonGroup variant="outlined" className="response" aria-label="outlined button group">
                            <Button id="questionaire" className="hidden" color="success" onClick={questionaire}>Continue</Button>
                        </ButtonGroup>
					</Card>

                    <div id="calendarView" className="card hidden">
                        <div>{datetime}</div>
                        <Calendar onChange={onChangeDate} value={date} />
                    </div>
      

					<ButtonGroup id="control" variant="outlined" className="response hidden" aria-label="outlined button group">
						<Button id="prev" color="error" onClick={prev}>Previous</Button>
						<Button id="next" color="success" onClick={next}>Next</Button>
					</ButtonGroup>

					<ButtonGroup id="navigation" variant="outlined" className="response" aria-label="outlined button group">
                        <Button id="calendar" className="start" variant="contained" onClick={calender}>Calendar</Button>
                        {progress !== 0 && <Button 
                                                id="download" 
                                                className="start hidden" 
                                                variant="contained" 
                                                href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(Object.fromEntries(new FormData(document.querySelector('form')).entries())))}`} 
                                                download="poopData.json"
                                                > Download Report </Button>}
                        <Button id="start" className="start" variant="contained" onClick={start}>Start</Button>
                    </ButtonGroup>

					<TextField id="text" className="hidden" label="Outlined" variant="outlined" />
				</form>
			</ThemeProvider>
		</div>
	);
}

export default App;
