/* ==========================================
   MARKETFLOW — MARKETING SAAS
   JavaScript Interactions
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // 1. MOBILE NAVIGATION
  // ==========================================

  const menuToggle = document.querySelector(
    ".menu-toggle, .nav-toggle, .hamburger, #menuToggle, #menu-toggle"
  );

  const navMenu = document.querySelector(
    ".nav-links, .navbar-links, .nav-menu, #navMenu, #nav-menu"
  );

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("active");

      menuToggle.classList.toggle("active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("menu-open", isOpen);
    });

    navMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      });
    });
  }


  // ==========================================
  // 2. STICKY NAVBAR
  // ==========================================

  const navbar = document.querySelector(
    ".navbar, header, .site-header"
  );

  function updateNavbar() {
    if (navbar) {
      navbar.classList.toggle("scrolled", window.scrollY > 30);
    }
  }

  window.addEventListener("scroll", updateNavbar, {
    passive: true
  });

  updateNavbar();


  // ==========================================
  // 3. SMOOTH SCROLL FOR INTERNAL LINKS
  // ==========================================

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        event.preventDefault();
        return;
      }

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

        if (history.replaceState) {
          history.replaceState(null, "", targetId);
        }
      }
    });
  });


  // ==========================================
  // 4. PRICING TOGGLE
  // MONTHLY / YEARLY
  // ==========================================

  const pricingToggle = document.querySelector(
    "#pricingToggle, #billingToggle, .pricing-toggle input, .billing-toggle input, [data-pricing-toggle]"
  );

  const monthlyButtons = document.querySelectorAll(
    "[data-monthly-price]"
  );

  const yearlyButtons = document.querySelectorAll(
    "[data-yearly-price]"
  );

  const monthlyLabels = document.querySelectorAll(
    ".monthly-label, [data-billing='monthly']"
  );

  const yearlyLabels = document.querySelectorAll(
    ".yearly-label, [data-billing='yearly']"
  );

  function updatePricing(isYearly) {
    monthlyButtons.forEach(element => {
      element.textContent = element.dataset.monthlyPrice;
    });

    yearlyButtons.forEach(element => {
      element.textContent = element.dataset.yearlyPrice;
    });

    monthlyLabels.forEach(element => {
      element.classList.toggle("active", !isYearly);
    });

    yearlyLabels.forEach(element => {
      element.classList.toggle("active", isYearly);
    });

    document.querySelectorAll("[data-price]").forEach(element => {
      const price = isYearly
        ? element.dataset.yearly
        : element.dataset.monthly;

      if (price !== undefined) {
        element.textContent = price;
      }
    });

    document.querySelectorAll("[data-period]").forEach(element => {
      element.textContent = isYearly ? "/year" : "/month";
    });

    document.querySelectorAll(".pricing-card").forEach(card => {
      card.classList.toggle("yearly-pricing", isYearly);
    });
  }

  if (pricingToggle) {
    pricingToggle.addEventListener("change", () => {
      updatePricing(pricingToggle.checked);
    });

    updatePricing(pricingToggle.checked);
  }


  // ==========================================
  // 5. FAQ ACCORDION
  // ==========================================

  const faqItems = document.querySelectorAll(
    ".faq-item, .faq-card, [data-faq-item]"
  );

  faqItems.forEach(item => {
    const question = item.querySelector(
      ".faq-question, .faq-header, .faq-trigger, button"
    );

    const answer = item.querySelector(
      ".faq-answer, .faq-content, .faq-body"
    );

    if (!question || !answer) return;

    question.setAttribute("aria-expanded", "false");
    answer.hidden = true;

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      faqItems.forEach(otherItem => {
        otherItem.classList.remove("active");

        const otherQuestion = otherItem.querySelector(
          ".faq-question, .faq-header, .faq-trigger, button"
        );

        const otherAnswer = otherItem.querySelector(
          ".faq-answer, .faq-content, .faq-body"
        );

        if (otherQuestion) {
          otherQuestion.setAttribute("aria-expanded", "false");
        }

        if (otherAnswer) {
          otherAnswer.hidden = true;
        }
      });

      if (!isOpen) {
        item.classList.add("active");
        question.setAttribute("aria-expanded", "true");
        answer.hidden = false;
      }
    });
  });


  // ==========================================
  // 6. TOAST NOTIFICATIONS
  // ==========================================

  function showToast(message, type = "success") {
    let toast = document.querySelector("#marketflowToast");

    if (!toast) {
      toast = document.createElement("div");
      toast.id = "marketflowToast";

      Object.assign(toast.style, {
        position: "fixed",
        bottom: "24px",
        right: "24px",
        maxWidth: "calc(100vw - 32px)",
        padding: "14px 20px",
        borderRadius: "10px",
        background: "#111827",
        color: "#ffffff",
        fontSize: "14px",
        lineHeight: "1.5",
        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
        zIndex: "99999",
        opacity: "0",
        transform: "translateY(10px)",
        transition: "opacity 0.25s ease, transform 0.25s ease"
      });

      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.borderLeft =
      type === "error"
        ? "4px solid #EF4444"
        : "4px solid #22C55E";

    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");

    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";

    clearTimeout(toast.hideTimer);

    toast.hideTimer = setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
    }, 3500);
  }


  // ==========================================
  // 7. LEAD CAPTURE FORM VALIDATION
  // ==========================================

  const leadForms = document.querySelectorAll(
    "#leadForm, #contactForm, #trialForm, .lead-form, .contact-form, .trial-form"
  );

  leadForms.forEach(form => {
    form.addEventListener("submit", async event => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const emailInput = form.querySelector(
        'input[type="email"]'
      );

      if (emailInput) {
        const email = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
          emailInput.setCustomValidity(
            "Please enter a valid email address."
          );

          emailInput.reportValidity();
          emailInput.setCustomValidity("");
          return;
        }
      }

      const submitButton = form.querySelector(
        'button[type="submit"], input[type="submit"]'
      );

      const originalText = submitButton
        ? submitButton.textContent
        : "";

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Please wait...";
      }

      try {
        /*
          IMPORTANT:
          This is frontend validation only.

          To save leads, connect this form to a backend API
          or a trusted form-processing service.

          Example:
          const response = await fetch("/api/leads", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(
              Object.fromEntries(new FormData(form))
            )
          });

          if (!response.ok) {
            throw new Error("Lead submission failed");
          }
        */

        showToast(
          "Form validated successfully! Connect a backend to submit your details."
        );

      } catch (error) {
        console.error("Form submission error:", error);

        showToast(
          "Something went wrong. Please try again.",
          "error"
        );

      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }
      }
    });
  });


  // ==========================================
  // 8. NEWSLETTER FORM
  // ==========================================

  const newsletterForms = document.querySelectorAll(
    ".newsletter-form, #newsletterForm"
  );

  newsletterForms.forEach(form => {
    form.addEventListener("submit", event => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      showToast(
        "Email validated! Connect a newsletter service to subscribe."
      );

      form.reset();
    });
  });


  // ==========================================
  // 9. MODAL / DEMO POPUP
  // ==========================================

  const modal = document.querySelector(
    "#demoModal, #modal, .demo-modal"
  );

  const openModalButtons = document.querySelectorAll(
    "[data-open-modal], .open-modal, .demo-btn, #openDemo"
  );

  const closeModalButtons = document.querySelectorAll(
    "[data-close-modal], .close-modal, .modal-close"
  );

  function openModal() {
    if (!modal) return;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const focusable = modal.querySelector(
      'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusable) focusable.focus();
  }

  function closeModal() {
    if (!modal) return;

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  openModalButtons.forEach(button => {
    button.addEventListener("click", event => {
      if (!modal) {
        const target = button.getAttribute("href");

        if (target && target.startsWith("#")) {
          const section = document.querySelector(target);

          if (section) {
            event.preventDefault();

            section.scrollIntoView({
              behavior: "smooth"
            });
          }
        }

        return;
      }

      event.preventDefault();
      openModal();
    });
  });

  closeModalButtons.forEach(button => {
    button.addEventListener("click", closeModal);
  });

  if (modal) {
    modal.addEventListener("click", event => {
      if (event.target === modal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeModal();
      }
    });
  }


  // ==========================================
  // 10. SCROLL REVEAL ANIMATIONS
  // ==========================================

  const revealElements = document.querySelectorAll(
    ".reveal, .fade-in, .animate-on-scroll"
  );

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(element => {
      element.classList.add("visible");
    });
  }


  // ==========================================
  // 11. CTA BUTTON FEEDBACK
  // ==========================================

  document.querySelectorAll("[data-toast]").forEach(button => {
    button.addEventListener("click", () => {
      showToast(button.dataset.toast);
    });
  });


  // ==========================================
  // 12. CURRENT YEAR IN FOOTER
  // ==========================================

  document.querySelectorAll(
    "#currentYear, .current-year, [data-current-year]"
  ).forEach(element => {
    element.textContent = new Date().getFullYear();
  });


  // ==========================================
  // 13. BACK TO TOP BUTTON
  // ==========================================

  const backToTop = document.querySelector(
    "#backToTop, .back-to-top"
  );

  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle(
        "visible",
        window.scrollY > 400
      );
    }, {
      passive: true
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }


  // ==========================================
  // 14. COPYRIGHT YEAR FALLBACK
  // ==========================================

  const footerYear = document.querySelector("#footerYear");

  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }


  // ==========================================
  // INITIALIZATION COMPLETE
  // ==========================================

  console.log("MarketFlow JavaScript initialized successfully.");

});