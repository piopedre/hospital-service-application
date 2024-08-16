import React from "react";
import classes from "./ProductForm.module.css";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import Modal from "../Modal/Modal";
import Spinner from "../UI/Spinner/Spinner";
const productForm = (props) => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"))?.id;
  const $unit = JSON.parse(sessionStorage.getItem("unit"))?.id;
  const clinic = JSON.parse(sessionStorage.getItem("clinic"))?.id;
  return props.loading ? (
    <Spinner />
  ) : (
    <React.Fragment>
      <Modal
        show={props.modal}
        modalClosed={props.closeModal}
      >
        <form
          className={classes.modalProductCategory}
          onSubmit={(e) => props.addCategory(e, token, props.setFormState)}
        >
          <h4> Provide Product Category</h4>
          <Input
            label='PRODUCT CATEGORY'
            config={{
              placeholder: "TYPE IN PRODUCT CATEGORY",
              required: true,
              name: "category",
              value: props.state.category,
              readOnly: props.addState?.firstClick,
            }}
            changed={(e) => props.changed(e, props.setFormState)}
          />
          <Button config={{ type: "submit" }}>SUBMIT</Button>
        </form>
      </Modal>
      <form
        className={classes.productForm}
        onClick={() =>
          props.formType === "Edit"
            ? null
            : props.setAddState((prevState) => {
                return {
                  ...prevState,
                  searchModal: false,
                };
              })
        }
        onSubmit={(e) => {
          e.preventDefault();
          props.formType === "Add"
            ? props.addProduct(
                e,
                token,
                $location,
                $unit,
                props.setFormState,
                props.options,
                clinic,
                props.setAddState
              )
            : props.editProduct(
                e,
                props.id,
                token,
                $unit,
                $location,
                props.setModal,
                props.options,
                clinic,
                props.setSearch
              );
        }}
      >
        <h3>Provide Product Information</h3>
        <div className={classes.product}>
          <span>Product Information </span>
          <div className={classes.minCtn}>
            <Input
              label='Product Name'
              config={{
                ref: props.drugRef,
                autoFocus: true,
                required: true,
                placeholder: "E.g Tab Haloperidol 5mg",
                value: props.state.name,
                name: "name",
              }}
              changed={(e) => {
                props.changed(e, props.setFormState);
              }}
            >
              {props?.addState?.searchModal ? (
                <div id={classes.searchModal}>
                  {props?.addState?.loading ? (
                    <Spinner />
                  ) : (
                    props?.addState.products.map((product) => (
                      <div
                        className={classes.productItem}
                        key={product._id}
                        onClick={(e) =>
                          props.editForm(
                            e,
                            product._id,
                            props?.addState.products,
                            props.state,
                            props.setFormState,
                            props?.setAddState
                          )
                        }
                      >
                        {product.name}
                      </div>
                    ))
                  )}
                </div>
              ) : null}
            </Input>

            <div
              className={classes.productCategory}
              id={classes.productId}
            >
              <Input
                title='Product Category'
                inputType='select'
                options={props.options.map((opt) => opt.category)}
                config={{
                  required: true,
                  value: props.state.productCategory,
                  name: "productCategory",
                  readOnly: !props.readOnly && props.formType === "Add",
                }}
                changed={(e) => props.changed(e, props.setFormState)}
              />

              <Button
                config={{ type: "button" }}
                changed={props.openModal}
              >
                ADD
              </Button>
            </div>
          </div>
        </div>
        <div
          className={classes.productInformation}
          id={classes.informationId}
        >
          <span>Product Quantity Information </span>
          <div className={classes.minCtn}>
            {/* <Input
              label='Unit Issue'
              config={{
                type: "number",
                required: true,
                placeholder: "Unit of issue",
                value: props.state.unitOfIssue,
                min: "1",
                name: "unitOfIssue",
                readOnly: !props.readOnly && props.formType === "Add",
              }}
              changed={(e) => props.changed(e, props.setFormState)}
            /> */}
            {/* <Input
              label='Issue Quantity'
              config={{
                type: "number",
                required: true,
                pattern: "^[0-9]\\d*(\\.\\d+)?$",
                placeholder: "Issue Quantity",
                value: props.state.issueQuantity,
                readOnly: !props.readOnly && props.formType === "Add",
                name: "issueQuantity",
              }}
              changed={(e) => props.changed(e, props.setFormState)}
            /> */}
            <Input
              label='Pack Size'
              config={{
                type: "number",
                required: true,
                placeholder: "Pack size",
                value: props.state.packSize,
                min: "1",
                name: "packSize",
                readOnly: !props.readOnly && props.formType === "Add",
              }}
              changed={(e) => props.changed(e, props.setFormState)}
            />
            <Input
              label='Quantity'
              config={{
                required: true,
                pattern: "^[0-9]\\d*(\\.\\d+)?$",
                placeholder: "Quantity",
                value: props.state.quantity,
                min: "0",
                name: "quantity",
              }}
              changed={(e) => props.changed(e, props.setFormState)}
            />
            <Input
              label='minimum Quantity'
              config={{
                type: "number",
                required: true,
                placeholder: "minimum Quantity",
                value: props.state.minimumQuantity,
                min: "0",
                name: "minimumQuantity",
              }}
              changed={(e) => props.changed(e, props.setFormState)}
            />
          </div>
        </div>
        <div
          className={classes.price}
          id={classes.priceId}
        >
          <span>Product Manufacturer Information </span>
          <div className={classes.minCtn}>
            <Input
              label='Cost Price'
              config={{
                required: true,
                placeholder: "Price",
                pattern: "^[0-9]\\d*(\\.\\d+)?$",
                value: props.state.costPrice,
                name: "costPrice",
                readOnly: !props.readOnly && props.formType === "Add",
              }}
              changed={(e) => props.changed(e, props.setFormState)}
            />
            <Input
              label='MarkUp'
              config={{
                placeholder: "1.25",
                pattern: "^[0-9]\\d*(\\.\\d+)?$",
                name: "markUp",
                value: props.state.markUp,
                readOnly: !props.readOnly && props.formType === "Add",
              }}
              changed={(e) => props.changed(e, props.setFormState)}
            />
            <Input
              label='Product Nhia  Price'
              config={{
                placeholder: " Nhia  Price",
                pattern: "^[0-9]\\d*(\\.\\d+)?$",
                value: props.state.fgPrice,
                name: "fgPrice",
                readOnly: !props.readOnly && props.formType === "Add",
              }}
              changed={(e) => props.changed(e, props.setFormState)}
            />
            <Input
              label='Product Expiry Date'
              config={{
                placeholder: "Expiry Date",
                type: "month",
                value: props.state.expiryDate,
                name: "expiryDate",
                readOnly: !props.readOnly && props.formType === "Add",
              }}
              changed={(e) => props.changed(e, props.setFormState)}
            />
          </div>
        </div>
        <div className={classes.submitForm}>
          <Button config={{ type: "submit" }}>{props.formType} PRODUCT</Button>
        </div>
      </form>
    </React.Fragment>
  );
};
export default React.memo(productForm);
