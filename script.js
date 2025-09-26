const form = document.getElementById("registration-form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

// 拦截提交，先做校验
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const isRequiredValid = checkRequired([username, email, password, confirmPassword]);
  if (!isRequiredValid) return;

  const isUsernameValid  = checkLength(username, 3, 15);
  const isEmailValid     = checkEmail(email);
  const isPasswordValid  = checkLength(password, 6, 25);
  const isPasswordsMatch = checkPasswordsMatch(password, confirmPassword);

  if (isUsernameValid && isEmailValid && isPasswordValid && isPasswordsMatch) {
    alert("Registration successful!");
    form.reset();
    // 清除校验样式
    document.querySelectorAll(".form-item").forEach(item => item.className = "form-item");
  }
});

// 长度校验
function checkLength(input, min, max) {
  if (input.value.length < min) {
    showError(input, `${formatFieldName(input)} must be at least ${min} characters.`);
    return false;
  }
  if (input.value.length > max) {
    showError(input, `${formatFieldName(input)} must be less than ${max} characters.`);
    return false;
  }
  showSuccess(input);
  return true;
}

// 首字母大写
function formatFieldName(input) {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

// 邮箱格式
function checkEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(email.value.trim())) {
    showSuccess(email);
    return true;
  }
  showError(email, "Email is not valid");
  return false;
}

// 两次密码是否一致
function checkPasswordsMatch(input1, input2) {
  if (input1.value !== input2.value) {
    showError(input2, "Passwords do not match");
    return false;
  }
  return true;
}

// 空值检查
function checkRequired(inputArray) {
  let isValid = true;
  inputArray.forEach(input => {
    if (input.value.trim() === "") {
      showError(input, `${formatFieldName(input)} is required`);
      isValid = false;
    } else {
      showSuccess(input);
    }
  });
  return isValid;
}

// 显示错误
function showError(input, message) {
  const formGroup = input.parentElement;
  formGroup.className = "form-item error";
  formGroup.querySelector("small").innerText = message;
}

// 显示通过
function showSuccess(input) {
  const formGroup = input.parentElement;
  formGroup.className = "form-item success";
  formGroup.querySelector("small").innerText = "";
}