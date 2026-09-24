const body = document.body;
const menuOpenButton = document.getElementById("menu-open-button");
const menuCloseButton = document.getElementById("menu-close-button");
const navLinks = document.querySelectorAll(".nav-links");
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

if (menuOpenButton) {
  menuOpenButton.addEventListener("click", () => {
    body.classList.add("show-mobile-menu");
  });
}

if (menuCloseButton) {
  menuCloseButton.addEventListener("click", () => {
    body.classList.remove("show-mobile-menu");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("show-mobile-menu");
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) {
    body.classList.remove("show-mobile-menu");
  }
});

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector("button[type='submit']");
    const formData = new FormData(contactForm);
    const payload = {
      name: formData.get("name")?.toString().trim(),
      email: formData.get("email")?.toString().trim(),
      phone: formData.get("phone")?.toString().trim(),
      subject: formData.get("subject")?.toString().trim(),
      message: formData.get("message")?.toString().trim()
    };

    if (!payload.name || !payload.email || !payload.message) {
      alert("Please fill in your name, email, and message.");
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong.");
      }

      alert("Thanks! Your message has been saved successfully.");
      contactForm.reset();
    } catch (error) {
      alert(error.message || "Failed to send message. Please try again.");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Send message";
      }
    }
  });
}
