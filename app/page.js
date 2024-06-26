'use client'

/*
  Using the component as client component
  Necessary Imports below
*/

import Image from "next/image";
import styles from "./page.module.css";
import genImage from './images/gen.png';
import { useState, useRef, useEffect } from "react";


// Exporting main home component

export default function Home() {


  // Seting some state variables and some refs

  const [bp, setBp] = useState("");
  const [features, setFeatures] = useState("");
  const [tone, setTone] = useState("Casual");
  const [length, setLength] = useState("Short");
  const [genText, setGenText] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [regenType, setRegenType] = useState("");
  const selTooltip = useRef(null)
  const waitTooltip = useRef(null)
  const gTextArea = useRef(null)
  const regen = useRef(null)

  // Using useEffect hook for adding some important event listeners for text selections
  // Also setting a 300ms delay before all these using a setTimeout function

  useEffect(() => {
    setTimeout(()=>{
      gTextArea.current.addEventListener('mouseup', event => {
        event.stopPropagation();
        if(window.getSelection().toString().length){
          console.log(event.clientY);
          selTooltip.current.style.visibility = "visible";
          selTooltip.current.style.top = `${(event.clientY+20)*0.063}em`;
          selTooltip.current.style.left = `${event.clientX*0.063}em`;
          let text = window.getSelection().toString();
          setSelectedText(text);
        }
    })

      gTextArea.current.addEventListener('touchend', e =>{
        e.stopPropagation();
        if(window.getSelection().toString().length){
          e.preventDefault()
          selTooltip.current.style.visibility = "visible";
          selTooltip.current.style.top = `${(e.touches[0].clientY+20)*0.063}em`;
          selTooltip.current.style.left = `${e.touches[0].clientX*0.063}em`;
          let text = window.getSelection().toString();
          setSelectedText(text);
        }
      })

      gTextArea.current.addEventListener('click', e =>{
        e.stopPropagation();
      })

      document.addEventListener('click', () =>{
        if(selTooltip.current.style.visibility === "visible"){
          selTooltip.current.style.visibility = "hidden";
        }
      })
    },300)
  }, [])


  // Function for handling the click of generate button

  async function generateText() {

    if(bp === "" || features === ""){
      alert("One or more fields are empty, Try again !")
    }
    else{

      // Notify user to wait 

      waitTooltip.current.style.visibility = "visible";
      waitTooltip.current.style.right = "4em";

      setTimeout(() => {
        waitTooltip.current.style.visibility = "hidden";
      }, 3000);

      setTimeout(() => {
        waitTooltip.current.style.right = "0em";
      }, 4000);

      let data = {
        brandPositioning : bp,
        features : features,
        tone : tone,
        length : length
      }
  
      const resp = await fetch("/generate", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
  
      if(resp.status !== 200){
        alert("Unable to generate text, Some Error Occured ! Please try again !")
      }
      else{
        const respData = await resp.json();
        setGenText(respData);
      }
    }
  }


  // Function for handling insert button click (inserting text into the database)

  async function insertIntoDB() {

    if(genText === "" || bp === "" || features === ""){
      alert("One or more fields are empty, Try again !")
    }
    else{
      let data = {
        brandPositioning : bp,
        features : features,
        tone : tone,
        length : length,
        output : genText
      }
  
      const resp = await fetch("/insert", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
  
      const rData = await resp.json();
  
      alert(rData);
    }
  }


  // Function for handling the click of the regenerate button

  async function regenerate() {
    if(selectedText === "" || regenType === ""){
      alert("No text selected or some error occured, Try again !")
    }
    else{

      waitTooltip.current.style.visibility = "visible";
      waitTooltip.current.style.right = "4em";

      setTimeout(() => {
        waitTooltip.current.style.visibility = "hidden";
      }, 3000);

      setTimeout(() => {
        waitTooltip.current.style.right = "0em";
      }, 4000);

      let data = {
        selectedPart : selectedText,
        type : regenType,
        completeText : genText
      }
  
      const resp = await fetch("/regenerate", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if(resp.status !== 200){
        alert("Unable to generate text, Some Error Occured !")
      }
      else{
        const respData = await resp.json();
        setGenText(respData);
      }
  }
}


// Functions for handling the clicks on make shorter and make longer dropdown buttons

  function makeShorter(){
    setRegenType("Shorter");
    selTooltip.current.style.visibility = "hidden";
    regen.current.style.background = "linear-gradient(45deg, #ff8e43, #e75b18de)";
    console.log(regen.current.style.backgroundColor);
    regen.current.style.boxShadow = "0px 0px 10px 1px #eb5f0f77"
  }
  
  function makeLonger(){
    selTooltip.current.style.visibility = "hidden";
    regen.current.style.background = "linear-gradient(45deg, #ff8e43, #e75b18de)";
    regen.current.style.boxShadow = "0px 0px 10px 1px #eb5f0f77"
    setRegenType("Longer");
  }


  // Main JSX goes here

  return (
    <main className={styles.baseStructure}>
      <section className={styles.genForm}>
        <article className={styles.inputsHolder}>
          <div className={styles.inputLabelEnclosure}>
            <label htmlFor="inpA">Brand Positioning :</label>
            <input type="text" placeholder="Enter text here" id="inpA" onChange={e => { setBp(e.target.value) }} />
          </div>
          <div className={styles.inputLabelEnclosure}>
            <label htmlFor="inpB">Features :</label>
            <input type="text" placeholder="Enter text here" id="inpB"  onChange={e => { setFeatures(e.target.value) }} />
          </div>
        </article>
        <article className={styles.inputsHolder}>
          <div className={styles.inputLabelEnclosure}>
            <label htmlFor="inpC">Tone :</label>
            <select id="inpC" onChange={e => { setTone(e.target.value) }} >
              <option value="Casual">Casual</option>
              <option value="Formal">Formal</option>
              <option value="Grandiose">Grandiose</option>
            </select>
          </div>
          <div className={styles.inputLabelEnclosure}>
            <label htmlFor="inpD">Length :</label>
            <select id="inpD" onChange={e => { setLength(e.target.value) }}>
              <option value="Short">Short</option>
              <option value="Medium">Medium</option>
              <option value="Long">Long</option>
            </select>
          </div>
        </article>
        <button onClick={generateText}><Image src={genImage} width={15} height={15}></Image><p>Generate</p></button>
        <article className={styles.genTextArea} ref={gTextArea}>{genText}</article>
        <button ref={regen} className={styles.regenerate} onClick={regenerate}>Regenerate</button>
        <button onClick={insertIntoDB}>Insert in DB</button>
      </section>
      <div className={styles.selectionTooltip} ref={selTooltip}>
        <p className={styles.selToolTipText} onClick={makeShorter}>Make it shorter</p>
        <p className={styles.selToolTipText} onClick={makeLonger}>Make it longer</p>
      </div>
      <div className={styles.waitTooltip} ref={waitTooltip}>
        <p className={styles.waitToolTipText}>Generating, Please Wait !</p>
      </div>
    </main>
  );
}
