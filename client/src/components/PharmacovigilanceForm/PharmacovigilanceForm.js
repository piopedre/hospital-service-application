import React, { Fragment, memo } from "react";
import Input from "../UI/Input/Input";
import classes from "./PharmacovigilanceForm.module.css";
import Button from "../UI/Button/Button";
const pharmacovigilanceForm = memo((props) => {
  return (
    <form
      className={classes.pharmacovigilanceForm}
      onSubmit={(e) =>
        props.validateForm(e, props.token, props.state, props.setState)
      }
    >
      <h3>PHARMACOVILIGANCE FORM</h3>
      <div>
        <div className={classes.sectionTitle}>
          <div>1</div>
          <div>* PATIENT DETAILS</div>
        </div>

        <div className={classes.patientSectionBody}>
          <div className={classes.patientSection}>
            <Input
              config={{
                placeholder: "NAME OF PATIENT",
                required: true,
                name: "patient",
                autoFocus: true,
              }}
              label='NAME OF PATIENT'
            />
            <Input
              config={{
                placeholder: "PATIENT RECORD NUMBER ",
                required: true,
                name: "recordNumber",
              }}
              label='FILE NUMBER'
            />
            <Input
              config={{
                placeholder: "DATE OF BIRTH",
                type: "date",
                required: true,
                name: "dateOfBirth",
              }}
              label='DATE OF BIRTH'
            />
            <Input
              config={{
                placeholder: "SEX",
                required: true,
                name: "sex",
              }}
              label='SEX'
            />
          </div>
          <div className={classes.sectionProps}>
            <Input
              config={{
                placeholder: "WEIGHT",
                required: true,
                name: "weight",
              }}
              label='WEIGHT'
            />
            <Input
              config={{
                placeholder: "NAME OF HOSPITAL OR TREATMENT CENTRE",
                required: true,
                name: "hospital",
              }}
              label=' HOSPITAL OR TREATMENT CENTRE'
            />
          </div>
        </div>
      </div>
      <div>
        <div className={classes.sectionTitle}>
          <div>2</div>
          <div>* ADVERSE DRUG REACTION (ADR)</div>
        </div>

        <div>
          <div className={classes.adrSection}>
            <div className={classes.adrDescription}>
              <div
                className={[
                  classes.adrSectionComp,
                  classes.reactionDescription,
                ].join(" ")}
              >
                <Input
                  label='DESCRIPTION'
                  inputType='text-area'
                  config={{
                    placeholder: "Describe the reaction",
                    required: true,
                    name: "description",
                  }}
                />
              </div>
              <div className={classes.adrSectionComp}>
                <Input
                  label='DATE REACTION STARTED'
                  config={{
                    type: "date",
                    required: true,
                    name: "dateStarted",
                  }}
                />
                <Input
                  label='DATE REACTION STOPPED'
                  config={{
                    type: "date",
                    required: true,
                    name: "dateStopped",
                  }}
                />
              </div>
              <div className={classes.outcomeReaction}>
                <span className={classes.outcomeTitle}>
                  Specify Outcome of Reaction
                </span>
                <Input
                  label='Outcome Of Reaction'
                  config={{
                    placeholder: "Outcome of Reaction",
                    required: true,
                    name: "outcome",
                  }}
                />
                <span>OPTIONS : </span>
                <span> RECOVERED FULLY</span>
                <span>RECOVERED WITH A DISABILITY (SPECIFY)</span>
                <span>CONGENTIAL ABNORMALITY (SPECIFY)</span>
                <span>LIFE THREATENING</span>
                <span>DEATH</span>
                <span>OTHERS (SPECIFY)</span>
              </div>
            </div>
          </div>
          <div className={classes.adrSecondSection}>
            <div className={classes.patientHospitalInfo}>
              <label>Was Patient Admitted Due to ADR</label>
              <div className={classes.hospitalCheckBox}>
                <Input
                  config={{
                    type: "radio",
                    name: "admitted",
                    value: "Yes",
                  }}
                  label='Yes'
                />
                <Input
                  config={{
                    type: "radio",
                    name: "admitted",
                    value: "No",
                  }}
                  label='No'
                />
              </div>
            </div>
            <div className={classes.patientHospitalInfo}>
              <label>
                If Already Hospitalized, was it prolonged due to ADR
              </label>
              <div className={classes.hospitalCheckBox}>
                <Input
                  config={{
                    type: "radio",
                    name: "prolonged",
                    value: "Yes",
                  }}
                  label='Yes'
                />
                <Input
                  config={{
                    type: "radio",
                    name: "prolonged",
                    value: "No",
                  }}
                  label='No'
                />
              </div>
            </div>
            <div className={classes.adrSectionComp}>
              <Input
                label='Duration of Admission (days)'
                config={{
                  required: true,
                  name: "duration",
                }}
              />
              <Input
                label='Treatment of Reaction'
                config={{
                  required: true,
                  name: "treatment",
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className={classes.sectionTitle}>
          <div>3</div>
          <div>
            * SUSPECTED DRUG (INCLUDING TRADITIONAL MEDICINES & COSMETICS)
          </div>
        </div>

        <div>
          <div className={classes.patientSection}>
            <Input
              config={{
                placeholder: "BRAND NAME",
                name: "brandName",
                required: true,
              }}
              label='BRAND NAME'
            />
            <Input
              config={{
                placeholder: "GENERIC NAME",
                name: "genericName",
                required: true,
              }}
              label='GENERIC NAME'
            />
            <Input
              config={{
                placeholder: "BATCH NO",
                name: "batchNo",
                required: true,
              }}
              label='BATCH NO'
            />
            <Input
              config={{
                placeholder: "NAFDAC NO",
                name: "nafdacNo",
                required: true,
              }}
              label='NAFDAC NO'
            />
            <Input
              config={{
                placeholder: "EXPIRY DATE",
                type: "month",
                name: "expiryDate",
                required: true,
              }}
              label='EXPIRY DATE'
            />
            <Input
              config={{
                placeholder: "NAME AND ADDRESS OF MANUFACTURER",
                name: "nameAndAdressOfManufacturer",
                required: true,
              }}
              label='NAME AND ADDRESS OF MANUFACTURER'
              inputType='text-area'
            />
          </div>
          <div className={classes.drugSecondSection}>
            <Input
              config={{
                placeholder: "INDICATIONS FOR USE",
                name: "indication",
                required: true,
              }}
              label='INDICATIONS FOR USE'
            />
            <Input
              config={{
                placeholder: "DOSAGE",
                name: "dosage",
                required: true,
              }}
              label='DOSAGE'
            />
            <Input
              config={{
                placeholder: "ROUTE OF ADMINISTRATION",
                name: "route",
                required: true,
              }}
              label='ROUTE OF ADMINISTRATION'
            />
            <Input
              config={{
                type: "date",
                placeholder: "DATE STARTED",
                name: "drugStarted",
                required: true,
              }}
              label='DATE STARTED'
            />
            <Input
              config={{
                type: "date",
                placeholder: "DATE STOPPED",
                name: "drugStopped",
                required: true,
              }}
              label='DATE STOPPED'
            />
          </div>
        </div>
      </div>

      <div>
        <div className={classes.sectionTitle}>
          <div>4</div>
          <div>
            * CONCOMITANT MEDICINES (ALL MEDICINES TAKEN WITHIN THE LAST 3
            MONTHS INCLUDING HERBAL AND SELF MEDICATIONS)
          </div>
        </div>

        <div>
          <div className={classes.concomitantHeadings}>
            <div>BRAND GENERIC NAME</div>
            <div>DOSAGE</div>
            <div>ROUTE</div>
            <div>DATE STARTED</div>
            <div>DATE STOPPED</div>
            <div>REASON FOR USE</div>
          </div>

          {props.state.concomitantMedicines.map((_, index) => (
            <div
              className={classes.concomitantHeadings}
              key={index}
            >
              <input
                placeholder='BRAND GENERIC NAME'
                onChange={(e) =>
                  props.setState((prevState) => {
                    const filteredItem = prevState.concomitantMedicines.find(
                      (_, i) => i == index
                    );
                    filteredItem.genericName = e.target.value;
                    const newItems = [...prevState.concomitantMedicines];
                    newItems.splice(index, 1, filteredItem);
                    return {
                      ...prevState,
                      concomitantMedicines: newItems,
                    };
                  })
                }
              />
              <input
                placeholder='DOSAGE'
                onChange={(e) =>
                  props.setState((prevState) => {
                    const filteredItem = prevState.concomitantMedicines.find(
                      (_, i) => i == index
                    );
                    filteredItem.dosage = e.target.value;
                    const newItems = [...prevState.concomitantMedicines];
                    newItems.splice(index, 1, filteredItem);
                    return {
                      ...prevState,
                      concomitantMedicines: newItems,
                    };
                  })
                }
              />
              <input
                placeholder='ROUTE'
                onChange={(e) =>
                  props.setState((prevState) => {
                    const filteredItem = prevState.concomitantMedicines.find(
                      (_, i) => i == index
                    );
                    filteredItem.route = e.target.value;
                    const newItems = [...prevState.concomitantMedicines];
                    newItems.splice(index, 1, filteredItem);
                    return {
                      ...prevState,
                      concomitantMedicines: newItems,
                    };
                  })
                }
              />
              <input
                type='date'
                placeholder='DATE STARTED'
                onChange={(e) =>
                  props.setState((prevState) => {
                    const filteredItem = prevState.concomitantMedicines.find(
                      (_, i) => i == index
                    );
                    filteredItem.dateStarted = e.target.value;
                    const newItems = [...prevState.concomitantMedicines];
                    newItems.splice(index, 1, filteredItem);
                    return {
                      ...prevState,
                      concomitantMedicines: newItems,
                    };
                  })
                }
              />
              <input
                type='date'
                placeholder='DATE STOPPED'
                onChange={(e) =>
                  props.setState((prevState) => {
                    const filteredItem = prevState.concomitantMedicines.find(
                      (_, i) => i == index
                    );
                    filteredItem.dateStopped = e.target.value;
                    const newItems = [...prevState.concomitantMedicines];
                    newItems.splice(index, 1, filteredItem);
                    return {
                      ...prevState,
                      concomitantMedicines: newItems,
                    };
                  })
                }
              />
              <input
                placeholder='REASON FOR USE'
                onChange={(e) =>
                  props.setState((prevState) => {
                    const filteredItem = prevState.concomitantMedicines.find(
                      (_, i) => i == index
                    );
                    filteredItem.reason = e.target.value;
                    const newItems = [...prevState.concomitantMedicines];
                    newItems.splice(index, 1, filteredItem);
                    return {
                      ...prevState,
                      concomitantMedicines: newItems,
                    };
                  })
                }
              />
              <div
                className={classes.removeMedicine}
                onClick={() =>
                  props.setState((prevState) => {
                    return {
                      ...prevState,
                      concomitantMedicines:
                        prevState.concomitantMedicines.filter(
                          (_, i) => i !== index
                        ),
                    };
                  })
                }
              >
                <span></span>
              </div>
            </div>
          ))}
          <Button
            config={{
              className: classes.confirm,
            }}
            changed={(e) => {
              e.preventDefault();
              props.setState((prevState) => {
                return {
                  ...prevState,
                  concomitantMedicines: [
                    ...prevState.concomitantMedicines,
                    {
                      genericName: "",
                      dosage: "",
                      route: "",
                      dateStarted: "",
                      dateStopped: "",
                      reason: "",
                    },
                  ],
                };
              });
            }}
          >
            ADD
          </Button>
        </div>
      </div>
      <div>
        <div className={classes.sectionTitle}>
          <div>5</div>
          <div>* SOURCE OF REPORT</div>
        </div>
        <div>
          <div className={classes.sourceReport}>
            <Input
              config={{
                placeholder: "NAME OF REPORTER",
                required: true,
                name: "reporter",
              }}
              label='NAME OF REPORTER'
            />
            <Input
              config={{
                placeholder: "ADDRESS",
                required: true,
                name: "reporterAddress",
              }}
              label='ADDRESS'
            />
            <Input
              config={{
                placeholder: "PROFESSION",
                name: "profession",
                required: true,
              }}
              label='PROFESSION'
            />
            <div id={classes.contact}>
              <Input
                config={{
                  placeholder: "DATE",
                  required: true,
                  type: "date",
                  name: "reportDate",
                }}
                label='DATE'
              />
              <Input
                config={{
                  placeholder: "EMAIL",
                  required: true,
                  type: "email",
                  name: "reporterEmail",
                }}
                label='EMAIL'
              />
              <Input
                config={{
                  placeholder: "TELEPHONE",
                  required: true,
                  type: "tel",
                  name: "reporterTelephone",
                }}
                label='TELEPHONE'
              />
            </div>
          </div>
        </div>
      </div>
      <Button
        config={{
          className: classes.hold,
        }}
      >
        SUBMIT
      </Button>
    </form>
  );
});

export default pharmacovigilanceForm;
