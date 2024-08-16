import React from "react";
import classes from "./PharmacovigilancePreview.module.css";
const pharmacovigilancePreview = React.memo((props) => {
  return (
    <div
      className={classes.preview}
      ref={props.pdfRef}
    >
      <h3>NATIONAL PHARMACOVIGILANCE CENTRE (NPC) NIGERIA</h3>
      <div>
        <div>
          <div className={classes.sectionTitle}>1. PATIENT DETAILS</div>
          <div
            style={{
              padding: "10px",
              margin: "10px",
            }}
          >
            <div className={classes.patientRecord}>
              <div className={classes.input}>
                <label>FULL NAME</label>
                <div>{props.state?.form?.patient}</div>
              </div>
              <div className={classes.input}>
                <label>PATIENT RECORD</label>
                <div>{props.state?.form?.recordNumber}</div>
              </div>
            </div>
            <div className={classes.birthSexWeight}>
              <div className={classes.input}>
                <label>DATE OF BIRTH</label>
                <div>{props.state?.form?.dateOfBirth}</div>
              </div>
              <div className={classes.input}>
                <label>SEX</label>
                <div>{props.state?.form?.sex}</div>
              </div>
              <div className={classes.input}>
                <label>WEIGHT</label>
                <div>{props.state?.form?.weight}</div>
              </div>
            </div>
            <div className={[classes.input, classes.hospital].join(" ")}>
              <label>HOSPITAL / TREATMENT CENTRE</label>
              <div>{props.state?.form?.hospital}</div>
            </div>
          </div>
        </div>
        <div>
          <div className={classes.sectionTitle}>
            2. ADVERSE DRUG REACTION (ADR)
          </div>
          <div
            className={classes.adrSection}
            style={{
              padding: "10px",
              margin: "10px",
            }}
          >
            <div>
              <div className={classes.description}>
                <label>DESCRIPTION</label>
                <div>{props.state?.form?.description}</div>
              </div>
              <div className={classes.reactionDate}>
                <div className={classes.reactionTimeFrame}>
                  <label>DATE REACTION STARTED </label>
                  <div>{props.state?.form?.dateStarted}</div>
                </div>
                <div className={classes.reactionTimeFrame}>
                  <label>DATE REACTION STOPPED </label>
                  <div>{props.state?.form?.dateStopped}</div>
                </div>
              </div>
            </div>
            <div>
              <div className={classes.outcomeReaction}>
                <div className={classes.inputOutcome}>
                  <label>OUTCOME OF REACTION</label>
                  <div>{props.state?.form?.outcome}</div>
                </div>
                <div className={classes.potentialOutcomes}>
                  <div>
                    N.B RECOVERED FULLY, RECOVERED WITH A DISABILITY
                    (SPECIFY),CONGENTIAL ABNORMALITY (SPECIFY) LIFE
                    THREATENING,DEATH,OTHERS (SPECIFY)
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={classes.adrSecondSection}
            style={{
              padding: "10px",
              margin: "10px",
            }}
          >
            <div className={classes.input}>
              <label>WAS PATIENT ADMITTED DUE TO ADR?</label>
              <div>{props.state?.form?.admitted}</div>
            </div>
            <div className={classes.input}>
              <label>
                IF ALREADY HOSPITALIZED, WAS IT PROLONGED DUE TO ADR?
              </label>
              <div>{props.state?.form?.prolonged}</div>
            </div>
            <div className={classes.input}>
              <label>DURATION OF ADMISSION (DAYS)</label>
              <div>{props.state?.form?.duration}</div>
            </div>
            <div className={classes.input}>
              <label>TREATMENT OF REACTION</label>
              <div>{props.state?.form?.treatment}</div>
            </div>
          </div>
        </div>
        <div>
          <div className={classes.sectionTitle}>
            3. * SUSPECTED DRUG (INCLUDING TRADITIONAL MEDICINES & COSMETICS)
          </div>
          <div
            style={{
              padding: "10px",
              margin: "10px",
            }}
          >
            <div className={classes.birthSexWeight}>
              <div className={classes.input}>
                <label>BRAND NAME</label>
                <div>{props.state?.form?.brandName}</div>
              </div>
              <div className={classes.input}>
                <label>GENERIC NAME</label>
                <div>{props.state?.form?.genericName}</div>
              </div>
              <div className={classes.input}>
                <label>BATCH NO</label>
                <div>{props.state?.form?.batchNo}</div>
              </div>
            </div>
            <div className={classes.patientRecord}>
              <div className={classes.input}>
                <label>NAFDAC NO</label>
                <div>{props.state?.form?.nafdacNo}</div>
              </div>
              <div className={classes.input}>
                <label>EXPIRY DATE</label>
                <div>{props.state?.form?.expiryDate}</div>
              </div>
            </div>
            <div className={classes.input}>
              <label>NAME AND ADDRESS OF MANUFACTURER</label>
              <div>{props.state?.form?.nameAndAdressOfManufacturer}</div>
            </div>
          </div>
          <div
            className={classes.drugSecondSection}
            style={{
              padding: "10px",
              margin: "10px",
            }}
          >
            <div className={classes.reactionTimeFrame}>
              <label>INDICATIONS FOR USE </label>
              <div>{props.state?.form?.indication}</div>
            </div>
            <div className={classes.reactionTimeFrame}>
              <label>DOSAGE </label>
              <div>{props.state?.form?.dosage}</div>
            </div>
            <div className={classes.reactionTimeFrame}>
              <label>ROUTE OF ADMINISTRATION </label>
              <div>{props.state?.form?.route}</div>
            </div>
            <div className={classes.reactionTimeFrame}>
              <label>DATE STARTED </label>
              <div>{props.state?.form?.drugStarted}</div>
            </div>
            <div className={classes.reactionTimeFrame}>
              <label>DATE STOPPED </label>
              <div>{props.state?.form?.drugStopped}</div>
            </div>
          </div>
        </div>
        <div>
          <div className={classes.sectionTitle}>
            4. * CONCOMITANT MEDICINES (ALL MEDICINES TAKEN WITHIN THE LAST 3
            MONTHS INCLUDING HERBAL AND SELF MEDICATIONS)
          </div>
          <div
            style={{
              padding: "10px",
              margin: "10px",
            }}
          >
            {props.state?.concomitantMedicines.map((med, i) => (
              <div
                className={classes.concomitantMedicines}
                key={i}
              >
                <div className={classes.reactionTimeFrame}>
                  <label>BRAND OR GENERIC NAME</label>
                  <div>{med.genericName}</div>
                </div>
                <div className={classes.reactionTimeFrame}>
                  <label>DOSAGE </label>
                  <div>{med.dosage}</div>
                </div>
                <div className={classes.reactionTimeFrame}>
                  <label>ROUTE </label>
                  <div>{med.route}</div>
                </div>
                <div className={classes.reactionTimeFrame}>
                  <label>DATE STARTED </label>
                  <div>{med.dateStarted}</div>
                </div>
                <div className={classes.reactionTimeFrame}>
                  <label>DATE STOPPED </label>
                  <div>{med.dateStopped}</div>
                </div>
                <div className={classes.reactionTimeFrame}>
                  <label>REASON FOR USE </label>
                  <div>{med.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className={classes.sectionTitle}>5. * SOURCE OF REPORT</div>
          <div
            style={{
              padding: "10px",
              margin: "10px",
            }}
          >
            <div className={classes.patientRecord}>
              <div className={classes.input}>
                <label>NAME OF REPORTER</label>
                <div>{props.state?.form?.reporter}</div>
              </div>
              <div className={classes.input}>
                <label>PROFESSION</label>
                <div>{props.state?.form?.profession}</div>
              </div>
            </div>

            <div className={classes.input}>
              <label>ADDRESS OF REPORTER</label>
              <div>{props.state?.form?.reporterAddress}</div>
            </div>
          </div>
          <div
            className={classes.birthSexWeight}
            style={{
              padding: "10px",
              margin: "10px",
            }}
          >
            <div className={classes.input}>
              <label>DATE</label>
              <div>{props.state?.form?.reportDate}</div>
            </div>
            <div className={classes.input}>
              <label>TELEPHONE</label>
              <div>{props.state?.form?.reporterTelephone}</div>
            </div>
            <div className={classes.input}>
              <label>EMAIL</label>
              <div>{props.state?.form?.reporterEmail}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default pharmacovigilancePreview;
