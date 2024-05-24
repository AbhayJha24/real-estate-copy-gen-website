'use client'

import Image from "next/image";
import styles from "./page.module.css";
import GenTextArea from './components/_genTextArea';
import { useRef, useState } from "react";

export default function Home() {

  const genTextArea = useRef(null);
  const [bp, setBp] = useState("");
  const [features, setFeatures] = useState("");
  const [tone, setTone] = useState("Casual");
  const [length, setLength] = useState("Short");

  async function generateText() {

    let data = {
      brandPositioning : bp,
      features : features,
      tone : tone,
      length : length
    }

    console.log(JSON.stringify(data))

    const resp = await fetch("/generate", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const respData = await resp.json();
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
        <GenTextArea ref={genTextArea}></GenTextArea>
        <button>Insert in DB</button>
      </section>
    </main>
  );
}
