export const setProductDispensed = (id, database, setState) => {
  const selectedSale = database.find((data) => data._id === id);
  setState((prevState) => {
    return {
      ...prevState,
      modal: true,
      productsDispensed: selectedSale.products,
    };
  });
};

export const getAnalysisData = (database) => {
  if (!database.length) {
    return {
      patientNumber: 0,
      totalPrice: 0,
      prescriptionNumber: 0,
    };
  } else {
    const patientsRegistered = database.filter((sale) => sale.patient);
    const noRegisteredPatients = database.filter((sale) => !sale.patient);
    let patientNumber = null;
    if (patientsRegistered.length) {
      patientNumber = Object.values(
        patientsRegistered.reduce((acc, cur) => {
          cur[cur.patient._id]
            ? acc[cur.patient._id]++
            : (acc[cur.patient._id] = 1);
          return acc;
        }, {})
      ).reduce((acc, cur) => {
        acc += cur;
        return acc;
      });
    }

    patientNumber = patientNumber + noRegisteredPatients.length;
    const { prescriptionNumber, totalPrice } = database.reduce(
      (acc, cur, _, arr) => {
        acc.prescriptionNumber = arr.length;
        acc.totalPrice += cur.totalPrice;
        return acc;
      },
      {
        prescriptionNumber: 0,
        totalPrice: 0,
      }
    );
    return {
      prescriptionNumber,
      totalPrice,
      patientNumber,
    };
  }
};
// PRODUCT SALES
export const setSaleHandler = (id, setState, sales) => {
  const selectedSale = sales.find((sale) => sale._id === id);
  if (selectedSale) {
    setState((prevState) => {
      return {
        ...prevState,
        selectedSale,
        preview: true,
      };
    });
  }
};
// FEEDBACK
export const addFeedbackRequest = async (token, body) => {
  const response = await fetch("/api/feedback", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
};

export const getFeedbackRequest = async (token, object) => {
  const queryString = Object.keys(object)
    .map((key) => `${[key]}=${object[key]}`)
    .join("&");
  const response = await fetch(`/api/feedback?${queryString}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
};
