'use client'

import Image from "next/image";
import styles from "./page.module.css";
import GenTextArea from './components/_genTextArea';
import { useState } from "react";

export default function Home() {

  const [bp, setBp] = useState("");
  const [features, setFeatures] = useState("");
  const [tone, setTone] = useState("Casual");
  const [length, setLength] = useState("Short");
  const [genText, setGenText] = useState("");

  async function generateText() {

    if(bp === "" || features === ""){
      alert("One or more fields are empty, Try again !")
    }
    else{
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
  
      const respData = await resp.json();
  
      setGenText(respData);
    }
  }

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
        <button onClick={generateText}>Generate</button>
        <GenTextArea gt={genText}></GenTextArea>
        <button onClick={insertIntoDB}>Insert in DB</button>
      </section>
    </main>
  );
}
