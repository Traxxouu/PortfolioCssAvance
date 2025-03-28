document.addEventListener('DOMContentLoaded', () => {
  // Sélection des éléments DOM
  const header = document.querySelector('.header');
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav__link');
  const scrollElements = document.querySelectorAll('.scroll-reveal');
  const projectSlider = document.querySelector('.project-slider');
  const projectNavPrev = document.querySelector('.project-nav__btn.prev');
  const projectNavNext = document.querySelector('.project-nav__btn.next');
  const projectIndicators = document.querySelectorAll('.project-nav__indicators span');
  const digitalCard = document.querySelector('.card-preview__inner');
  const parallaxElements = document.querySelectorAll('.parallax-element');
  const filmStrips = document.querySelectorAll('.film-strip');
  const netflixCards = document.querySelectorAll('.netflix-card');
  const scrollTopBtn = document.querySelector('.scroll-top');
  const netflixIntro = document.getElementById('netflixIntro');
  
  // Masquer l'intro après un court délai (si elle existe)
  if (netflixIntro) {
    setTimeout(() => {
      netflixIntro.style.opacity = '0';
      netflixIntro.style.visibility = 'hidden';
    }, 2500);
  }

  // ============================================
  // Navigation et Header
  // ============================================
  
  // Changement de style du header au scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Animation des éléments au scroll
    handleScrollAnimations();
    
    // Parallaxe au scroll
    handleParallaxEffect();
    
    // Scroll Top button
    if (scrollTopBtn && window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else if (scrollTopBtn) {
      scrollTopBtn.classList.remove('visible');
    }
  });
  
  // Hamburger menu pour mobile
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.classList.toggle('nav-open');
    });
  }
  
  // Fermer le menu mobile quand on clique sur un lien
  if (navLinks) {
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        document.body.classList.remove('nav-open');
      });
    });
  }
  
  // ============================================
  // Animations au scroll
  // ============================================
  
  function handleScrollAnimations() {
    if (scrollElements && scrollElements.length > 0) {
      scrollElements.forEach(element => {
        // Si l'élément est visible
        if (isElementInViewport(element)) {
          element.classList.add('revealed');
        }
      });
    }
  }
  
  function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
    );
  }
  
  // ============================================
  // Effet Parallaxe
  // ============================================
  
  function handleParallaxEffect() {
    if (parallaxElements && parallaxElements.length > 0) {
      parallaxElements.forEach(element => {
        const scrollPosition = window.scrollY;
        const elementPosition = element.offsetTop;
        const distance = elementPosition - scrollPosition;
        const speed = parseFloat(element.dataset.speed || 0.2);
        
        // Calculer la transformation basée sur la distance et la vitesse
        if (isElementInPartialViewport(element)) {
          element.style.transform = `translateY(${distance * speed}px)`;
        }
      });
    }
  }
  
  function isElementInPartialViewport(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    return (
      rect.top <= windowHeight + 300 &&
      rect.bottom >= -300
    );
  }
  
  // ============================================
  // Effet de Strip Film Netflix
  // ============================================
  
  if (filmStrips && filmStrips.length > 0) {
    filmStrips.forEach(strip => {
      // Dupliquer le contenu pour un défilement sans fin
      strip.querySelector('.film-strip__container').innerHTML += strip.querySelector('.film-strip__container').innerHTML;
      
      // Animer le défilement
      const speed = parseFloat(strip.dataset.speed || 20); // secondes
      strip.querySelector('.film-strip__container').style.animation = `filmStrip ${speed}s linear infinite`;
    });
  }
  
  // ============================================
  // Netflix Cards Hover Effect
  // ============================================
  
  if (netflixCards && netflixCards.length > 0) {
    netflixCards.forEach(card => {
      card.addEventListener('mouseenter', handleCardEnter);
      card.addEventListener('mouseleave', handleCardLeave);
      
      // Ajouter un délai pour éviter les déclenchements accidentels
      let hoverTimeout;
      
      function handleCardEnter() {
        clearTimeout(hoverTimeout);
        
        // Réinitialiser tous les autres cards
        netflixCards.forEach(otherCard => {
          if (otherCard !== card) {
            otherCard.classList.remove('active');
          }
        });
        
        hoverTimeout = setTimeout(() => {
          card.classList.add('active');
          
          // Jouer le trailer si disponible
          const trailer = card.querySelector('video');
          if (trailer) {
            trailer.currentTime = 0;
            trailer.play().catch(e => console.log('Autoplay failed:', e));
          }
        }, 300);
      }
      
      function handleCardLeave() {
        clearTimeout(hoverTimeout);
        
        hoverTimeout = setTimeout(() => {
          card.classList.remove('active');
          
          // Arrêter le trailer
          const trailer = card.querySelector('video');
          if (trailer) {
            trailer.pause();
          }
        }, 300);
      }
    });
  }
  
  // ============================================
  // Slider des projets
  // ============================================
  
  if (projectSlider && projectNavPrev && projectNavNext) {
    let currentSlide = 0;
    const projects = projectSlider.querySelectorAll('.project');
    const totalProjects = projects.length;
    
    // Afficher seulement le premier projet au début
    showSlide(currentSlide);
    
    // Navigation précédent/suivant
    projectNavPrev.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + totalProjects) % totalProjects;
      showSlide(currentSlide);
    });
    
    projectNavNext.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % totalProjects;
      showSlide(currentSlide);
    });
    
    // Gestion des indicateurs
    if (projectIndicators && projectIndicators.length > 0) {
      projectIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
          currentSlide = index;
          showSlide(currentSlide);
        });
      });
    }
    
    function showSlide(index) {
      // Masquer tous les projets
      projects.forEach((project, i) => {
        project.style.display = i === index ? 'block' : 'none';
        
        // Animation avec effet Netflix
        if (i === index) {
          project.style.opacity = '0';
          project.style.transform = 'scale(0.95)';
          setTimeout(() => {
            project.style.opacity = '1';
            project.style.transform = 'scale(1)';
            project.style.transition = 'all 0.5s ease';
          }, 50);
        }
      });
      
      // Mettre à jour les indicateurs
      if (projectIndicators && projectIndicators.length > 0) {
        projectIndicators.forEach((indicator, i) => {
          indicator.classList.toggle('active', i === index);
        });
      }
    }
  }
  
  // ============================================
  // Animation de la carte numérique 3D
  // ============================================
  
  if (digitalCard) {
    // Effet de carte 3D
    digitalCard.addEventListener('mousemove', (e) => {
      const cardRect = digitalCard.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      
      // Calculer la position relative de la souris
      const mouseX = e.clientX - cardCenterX;
      const mouseY = e.clientY - cardCenterY;
      
      // Calculer l'angle de rotation (limité à +-15 degrés)
      const rotateY = (mouseX / (cardRect.width / 2)) * 15;
      const rotateX = (mouseY / (cardRect.height / 2)) * -15;
      
      // Appliquer la transformation
      digitalCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    // Réinitialiser la rotation quand la souris quitte la carte
    digitalCard.addEventListener('mouseleave', () => {
      digitalCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
    
    // Effet de brillance
    const cardGlare = document.querySelector('.card-preview__glare');
    if (cardGlare) {
      digitalCard.addEventListener('mousemove', (e) => {
        const cardRect = digitalCard.getBoundingClientRect();
        
        // Calculer la position relative pour l'effet de brillance
        const mouseX = ((e.clientX - cardRect.left) / cardRect.width) * 100;
        const mouseY = ((e.clientY - cardRect.top) / cardRect.height) * 100;
        
        cardGlare.style.background = `radial-gradient(circle at ${mouseX}% ${mouseY}%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 60%)`;
      });
    }
  }
  
  // ============================================
  // Animation des compétences
  // ============================================
  
  const skillLevels = document.querySelectorAll('.skill__level');
  
  if (skillLevels && skillLevels.length > 0) {
    skillLevels.forEach(skill => {
      // Obtenir la largeur depuis le style
      const width = skill.style.width;
      
      // Réinitialiser la largeur pour l'animation
      skill.style.width = '0';
      
      // Définir la largeur cible comme variable CSS
      skill.style.setProperty('--skill-level', width);
      
      // Observer l'élément pour déclencher l'animation
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            skill.style.animation = 'skillFill 1s ease-out forwards';
            observer.unobserve(skill);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(skill);
    });
  }
  
  // ============================================
  // Bouton de retour en haut
  // ============================================
  
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // ============================================
  // Effet de glare pour les éléments
  // ============================================
  
  const glareElements = document.querySelectorAll('.glare-effect');
  
  if (glareElements && glareElements.length > 0) {
    glareElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (x - centerX) / centerX * 10;
        const angleY = (y - centerY) / centerY * 10;
        
        element.style.transform = `perspective(1000px) rotateX(${-angleY}deg) rotateY(${angleX}deg)`;
        
        // Effet de brillance
        const posX = (x / rect.width) * 100;
        const posY = (y / rect.height) * 100;
        
        element.style.background = `radial-gradient(circle at ${posX}% ${posY}%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 50%)`;
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        element.style.background = 'none';
      });
    });
  }
  
  // ============================================
  // Lazy Loading des images
  // ============================================
  
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if (lazyImages && lazyImages.length > 0) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.onload = () => {
              img.removeAttribute('data-src');
              img.classList.add('loaded');
            };
            observer.unobserve(img);
          }
        }
      });
    });
    
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  }
  
  // Initialiser les animations au chargement
  handleScrollAnimations();
  handleParallaxEffect();
  
  // Enhancements for Netflix-style project cards
  const cards = document.querySelectorAll('.netflix-card');
  const featuredCards = document.querySelectorAll('.netflix-card--featured');

  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.15}s`;

    card.addEventListener('mouseenter', () => {
      cards.forEach(otherCard => {
        if (otherCard !== card) {
          otherCard.style.opacity = '0.7';
          otherCard.style.transform = 'scale(0.95)';
        }
      });
    });

    card.addEventListener('mouseleave', () => {
      cards.forEach(otherCard => {
        otherCard.style.opacity = '1';
        otherCard.style.transform = '';
      });
    });
  });

  featuredCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const xPercent = (e.clientX - rect.left) / rect.width;
      const yPercent = (e.clientY - rect.top) / rect.height;

      card.style.transform = `scale(1.05) rotateY(${(xPercent - 0.5) * 10}deg) rotateX(${(0.5 - yPercent) * 10}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  cards.forEach(card => {
    card.setAttribute('tabindex', '0');

    card.addEventListener('focus', () => {
      card.classList.add('keyboard-focus');
      card.style.transform = 'scale(1.15) translateY(-10px)';
    });

    card.addEventListener('blur', () => {
      card.classList.remove('keyboard-focus');
      card.style.transform = '';
    });
  });
});