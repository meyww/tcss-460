
window.addEventListener('DOMContentLoaded', event => {
  // BMI

  const form = document.getElementById('calculatorForm');
  const statusDiv = document.getElementById('status');

  async function callAPI(route, data) {
      console.log("route: ", route);

      const formData = new FormData(form);
      console.log("formData", formData);

      var height_m = (formData.get("height_ft") * 30.48 + formData.get("height_in") * 2.54) / 100.0;
      var weight_kg = formData.get("weight") * 0.453592;
      var age_ = formData.get("age");
      var gender_ = formData.get("gender");

      data.height = height_m;
      data.weight = weight_kg;
      data.age = age_;
      data.gender= gender_;

      // var data = { height: height_m, weight: weight_kg };
      console.log("data", data);

      try {
          const res = await fetch(route, {
              method: "POST",
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(data)
          });

          json = await res.json();

          console.log("API response: ", json);
          statusDiv.innerHTML = `<p>Result: ${JSON.stringify(json)}</p>`;

          return json;
      } catch (error) {
          console.log("Error: ", error.message);
          statusDiv.innerHTML = `<p>Error: ${error.message}</p>`;
          return null;
      }
  }

  form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const bmiJSON = await callAPI("http://127.0.0.1:3000/bmi", {});
      const bodyFatJSON = await callAPI("http://127.0.0.1:3000/bodyfat", {bmi: bmiJSON.bmi});
      const weightJSON = await callAPI("http://127.0.0.1:3000/idealweight", {bmi: bmiJSON.idealWeight});
      const calorieJSON = await callAPI("http://127.0.0.1:3000/caloriesburned", {});

      //$("#infoDialog").modal("show");
      $("#valueBMI").html("Value BMI: " + bmiJSON.bmi);
      $("#valueBodyfat").html("Value Body Fat: " + bodyFatJSON.bodyFat);
      $("#idealWeight").html("Value Idea Weight: " + weightJSON.idealWeight);
      $("#calories").html("Value Calories Burn: " + calorieJSON.caloriesBurned);

     


  });
})
