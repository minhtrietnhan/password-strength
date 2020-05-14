const passwordMeter = document.getElementById("password-meter");
const passwordInput = document.getElementById("password-input");
const reasonsContainer = document.getElementById("reasons");

passwordInput.addEventListener("input", () => {
  if (passwordInput.value == "") {
    passwordMeter.classList.add("blinking-animation");
  } else {
    passwordMeter.classList.remove("blinking-animation");
  }
  updatePasswordMeter();
});

function updatePasswordMeter() {
  const password = passwordInput.value;
  const weaknesses = calculatePasswordStrength(password);
  var strength = 100;
  console.log("second");

  // Update infoContainer
  setInfoContainer(password, "upper", "Uppercase", /[A-Z]/g);
  setInfoContainer(password, "lower", "Lowercase", /[a-z]/g);
  setInfoContainer(password, "digits", "Digit", /[0-9]/g);
  setInfoContainer(password, "symbols", "Symbol", /[^A-Za-z0-9]/g);
  setNoOfCharacter(password);

  // Update all weaknesses and password-meter
  reasonsContainer.innerHTML = "";
  weaknesses.forEach((weakness) => {
    if (weakness == null) return;
    strength -= weakness.deduction;
    const reason = document.createElement("div");
    reason.innerText = weakness.message;
    reasonsContainer.appendChild(reason);
  });
  console.log(strength);
  passwordMeter.style.setProperty("--strength", strength);
}
function calculatePasswordStrength(password) {
  const weaknesses = [];
  weaknesses.push(lengthWeakness(password));
  weaknesses.push(
    specialCharacterWeakness(password, /[a-z]/g, "lowercase character", 10)
  ); // lowercase
  weaknesses.push(
    specialCharacterWeakness(password, /[A-Z]/g, "uppercase character", 10)
  ); // uppercase
  weaknesses.push(specialCharacterWeakness(password, /[0-9]/g, "number", 10)); // number
  weaknesses.push(
    specialCharacterWeakness(
      password,
      /[^A-Za-z0-9\s]/g,
      "special character",
      10
    )
  ); // special characters
  weaknesses.push(repeatedCharacterWeakness(password)); // repeated characters
  weaknesses.push(checkCommonPassword(password)); // commonPassword     // NEED REVISE
  return weaknesses;
}

function lengthWeakness(password) {
  if (password.length < 8) {
    return {
      message: "Your password is too short!",
      deduction: 50 - password.length * 1.5,
    };
  } else if (password.length < 12) {
    return {
      message: "Your password could be a little bit longer!",
      deduction: 50 - password.length * 2,
    };
  } else if (password.length < 16) {
    return {
      message: "The longer the password, the better!",
      deduction: 50 - password.length * 3.125,
    };
  } else return;
}

function specialCharacterWeakness(password, regex, reason, deductionRate) {
  const matches = password.match(regex) || [];
  if (matches.length == 0) {
    return {
      message: `Your password should contain at least a ${reason}.`,
      deduction: deductionRate,
    };
  }
  if (matches.length < 3) {
    return {
      message: `Your password should contain more ${reason}.`,
      deduction: deductionRate - matches.length,
    };
  } else return;
}

function repeatedCharacterWeakness(password) {
  console.log("inside repeated");
  if (password.length < 3)
    return {
      message: "",
      deduction: 10,
    };
  const matches = password.match(/(.)\1{2,}/g) || [];
  if (matches.length > 0) {
    return {
      message: "Your password contains repeated characters",
      deduction: 10 + matches.length * 5,
    };
  }
}

function checkCommonPassword(password) {
  var xhr = new XMLHttpRequest();
  var url =
    "https://raw.githubusercontent.com/tests-always-included/password-strength/master/data/common-passwords.json";
  //var matched = 0;
  xhr.open("GET", url);
  xhr.onload = function () {
    var commonPasswordList = JSON.parse(xhr.responseText);
    commonPasswordList.forEach((pass) => {
      if (password.localeCompare(pass) == 0) {
        //console.log("inside xhronload");
        reasonsContainer.innerHTML = "";
        const reason = document.createElement("div");
        reason.innerText =
          "Your password is very easy to guess! Try another one.";
        reasonsContainer.appendChild(reason);
        passwordMeter.style.setProperty(
          "--strength",
          parseInt(
            getComputedStyle(passwordMeter).getPropertyValue("--strength")
          ) - 80
        );
        return;
      }
    });
  };
  xhr.send();
}

function countCharacters(password, regex) {
  var char = password.match(regex) || [];
  return char.length;
}

function setInfoContainer(password, type, character, regex) {
  var count = countCharacters(password, regex);
  if (count > 0) {
    document.getElementById("radio-btn-" + type).style.background = "limegreen";
    if (count > 1) {
      document.getElementById(type + "-qty").innerText =
        `${count} ` + character + "s";
    } else {
      document.getElementById(type + "-qty").innerText =
        `${count} ` + character;
    }
  } else {
    document.getElementById("radio-btn-" + type).style.background = "red";
    document.getElementById(type + "-qty").innerText = "No " + character + "s";
  }
}

function setNoOfCharacter(password) {
  var text = `${password.length}` + " Character";
  if (password.length > 0) {
    if (password.length > 1) text += "s";
  } else text = "No Characters";
  document.getElementById("no-of-characters").innerText = text;
}
