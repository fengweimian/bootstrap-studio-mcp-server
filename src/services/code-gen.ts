const componentTemplates: Record<string, (props: string) => string> = {
  navbar: () => `<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Brand</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item"><a class="nav-link active" href="#">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Features</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Pricing</a></li>
      </ul>
    </div>
  </div>
</nav>`,

  card: () => `<div class="card" style="width: 18rem;">
  <img src="https://placehold.co/400x200" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">Card Title</h5>
    <p class="card-text">Some quick example text to build on the card title.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>`,

  form: () => `<form>
  <div class="mb-3">
    <label for="exampleEmail" class="form-label">Email address</label>
    <input type="email" class="form-control" id="exampleEmail" placeholder="name@example.com">
  </div>
  <div class="mb-3">
    <label for="examplePassword" class="form-label">Password</label>
    <input type="password" class="form-control" id="examplePassword">
  </div>
  <div class="mb-3 form-check">
    <input type="checkbox" class="form-check-input" id="exampleCheck">
    <label class="form-check-label" for="exampleCheck">Remember me</label>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>`,

  modal: () => `<!-- Button trigger modal -->
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Launch modal
</button>
<div class="modal fade" id="exampleModal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Modal Title</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <p>Modal body text goes here.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>`,

  table: () => `<table class="table">
  <thead>
    <tr><th>#</th><th>First</th><th>Last</th><th>Handle</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>Mark</td><td>Otto</td><td>@mdo</td></tr>
    <tr><td>2</td><td>Jacob</td><td>Thornton</td><td>@fat</td></tr>
    <tr><td>3</td><td>Larry</td><td>the Bird</td><td>@twitter</td></tr>
  </tbody>
</table>`,

  carousel: () => `<div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
  <div class="carousel-indicators">
    <button data-bs-target="#carouselExample" data-bs-slide-to="0" class="active"></button>
    <button data-bs-target="#carouselExample" data-bs-slide-to="1"></button>
    <button data-bs-target="#carouselExample" data-bs-slide-to="2"></button>
  </div>
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="https://placehold.co/800x400?text=Slide+1" class="d-block w-100" alt="Slide 1">
    </div>
    <div class="carousel-item">
      <img src="https://placehold.co/800x400?text=Slide+2" class="d-block w-100" alt="Slide 2">
    </div>
    <div class="carousel-item">
      <img src="https://placehold.co/800x400?text=Slide+3" class="d-block w-100" alt="Slide 3">
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
    <span class="carousel-control-prev-icon"></span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
    <span class="carousel-control-next-icon"></span>
  </button>
</div>`,

  accordion: () => `<div class="accordion" id="accordionExample">
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="true">
        Accordion Item #1
      </button>
    </h2>
    <div id="collapse1" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
      <div class="accordion-body">Content for item #1.</div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2">
        Accordion Item #2
      </button>
    </h2>
    <div id="collapse2" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">Content for item #2.</div>
    </div>
  </div>
</div>`,

  alert: () => `<div class="alert alert-primary" role="alert">
  A simple primary alert—check it out!
</div>`,

  badge: () => `<span class="badge bg-primary">Primary</span>
<span class="badge bg-secondary">Secondary</span>
<span class="badge bg-success">Success</span>`,

  breadcrumb: () => `<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="#">Home</a></li>
    <li class="breadcrumb-item"><a href="#">Library</a></li>
    <li class="breadcrumb-item active">Data</li>
  </ol>
</nav>`,

  progress: () => `<div class="progress" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">
  <div class="progress-bar" style="width: 60%">60%</div>
</div>`,

  spinner: () => `<div class="spinner-border text-primary" role="status">
  <span class="visually-hidden">Loading...</span>
</div>`,

  hero: () => `<section class="py-5 text-center container">
  <div class="row py-lg-5">
    <div class="col-lg-6 col-md-8 mx-auto">
      <h1 class="fw-light">Hero Title</h1>
      <p class="lead text-muted">Something short and leading about the collection below—its contents, the creator, etc.</p>
      <p>
        <a href="#" class="btn btn-primary my-2">Main call to action</a>
        <a href="#" class="btn btn-secondary my-2">Secondary action</a>
      </p>
    </div>
  </div>
</section>`,

  features: () => `<section class="py-5">
  <div class="container">
    <div class="row g-4">
      <div class="col-md-4">
        <div class="text-center">
          <div class="mb-3"><i class="bi bi-star fs-1 text-primary"></i></div>
          <h5>Feature One</h5>
          <p class="text-muted">Description of your amazing feature. Make it compelling.</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="text-center">
          <div class="mb-3"><i class="bi bi-heart fs-1 text-primary"></i></div>
          <h5>Feature Two</h5>
          <p class="text-muted">Description of your amazing feature. Make it compelling.</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="text-center">
          <div class="mb-3"><i class="bi bi-shield fs-1 text-primary"></i></div>
          <h5>Feature Three</h5>
          <p class="text-muted">Description of your amazing feature. Make it compelling.</p>
        </div>
      </div>
    </div>
  </div>
</section>`,

  footer: () => `<footer class="py-4 bg-body-tertiary mt-auto">
  <div class="container">
    <div class="row">
      <div class="col-md-4 mb-3">
        <h5>Company</h5>
        <p class="text-muted">Brief company description.</p>
      </div>
      <div class="col-md-4 mb-3">
        <h5>Links</h5>
        <ul class="list-unstyled">
          <li><a href="#" class="text-decoration-none">Home</a></li>
          <li><a href="#" class="text-decoration-none">About</a></li>
          <li><a href="#" class="text-decoration-none">Contact</a></li>
        </ul>
      </div>
      <div class="col-md-4 mb-3">
        <h5>Social</h5>
        <ul class="list-unstyled">
          <li><a href="#" class="text-decoration-none">Twitter</a></li>
          <li><a href="#" class="text-decoration-none">GitHub</a></li>
        </ul>
      </div>
    </div>
    <hr>
    <p class="text-center text-muted mb-0">&copy; 2024 Company, Inc</p>
  </div>
</footer>`,

  'contact-form': () => `<form class="row g-3 needs-validation" novalidate>
  <div class="col-md-6">
    <label for="firstName" class="form-label">First name</label>
    <input type="text" class="form-control" id="firstName" required>
  </div>
  <div class="col-md-6">
    <label for="lastName" class="form-label">Last name</label>
    <input type="text" class="form-control" id="lastName" required>
  </div>
  <div class="col-12">
    <label for="email" class="form-label">Email</label>
    <input type="email" class="form-control" id="email" required>
  </div>
  <div class="col-12">
    <label for="message" class="form-label">Message</label>
    <textarea class="form-control" id="message" rows="4" required></textarea>
  </div>
  <div class="col-12">
    <button type="submit" class="btn btn-primary">Send Message</button>
  </div>
</form>`,

  pricing: () => `<div class="row row-cols-1 row-cols-md-3 mb-3 text-center">
  <div class="col">
    <div class="card mb-4 rounded-3 shadow-sm">
      <div class="card-header py-3"><h4 class="my-0 fw-normal">Free</h4></div>
      <div class="card-body">
        <h1 class="card-title">$0<small class="text-muted fw-light">/mo</small></h1>
        <ul class="list-unstyled mt-3 mb-4">
          <li>10 users included</li>
          <li>2 GB of storage</li>
          <li>Email support</li>
        </ul>
        <button class="w-100 btn btn-lg btn-outline-primary">Sign up for free</button>
      </div>
    </div>
  </div>
  <div class="col">
    <div class="card mb-4 rounded-3 shadow-sm border-primary">
      <div class="card-header py-3 text-bg-primary border-primary"><h4 class="my-0 fw-normal">Pro</h4></div>
      <div class="card-body">
        <h1 class="card-title">$15<small class="text-muted fw-light">/mo</small></h1>
        <ul class="list-unstyled mt-3 mb-4">
          <li>20 users included</li>
          <li>10 GB of storage</li>
          <li>Priority email support</li>
        </ul>
        <button class="w-100 btn btn-lg btn-primary">Get started</button>
      </div>
    </div>
  </div>
</div>`,
};

const layoutTemplates: Record<string, string> = {
  'full-page': `<header>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container">
      <a class="navbar-brand" href="#">Brand</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="mainNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><a class="nav-link active" href="#">Home</a></li>
          <li class="nav-item"><a class="nav-link" href="#">About</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Contact</a></li>
        </ul>
      </div>
    </div>
  </nav>
</header>

<main>
  <section class="py-5 text-center container">
    <div class="row py-lg-5">
      <div class="col-lg-6 col-md-8 mx-auto">
        <h1 class="fw-light">Page Title</h1>
        <p class="lead text-muted">Something short and leading about the page.</p>
      </div>
    </div>
  </section>

  <div class="container py-4">
    <div class="row g-4">
      <div class="col-md-4">
        <div class="card h-100">
          <img src="https://placehold.co/400x200" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">Card One</h5>
            <p class="card-text">This is a wider card with supporting text below.</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100">
          <img src="https://placehold.co/400x200" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">Card Two</h5>
            <p class="card-text">This is a wider card with supporting text below.</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100">
          <img src="https://placehold.co/400x200" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">Card Three</h5>
            <p class="card-text">This is a wider card with supporting text below.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

<footer class="py-4 bg-body-tertiary mt-5">
  <div class="container text-center">
    <p class="text-muted mb-0">&copy; 2024 Company, Inc</p>
  </div>
</footer>`,

  dashboard: `<div class="container-fluid">
  <div class="row">
    <nav class="col-md-3 col-lg-2 d-md-block bg-body-tertiary sidebar">
      <div class="position-sticky pt-3">
        <ul class="nav flex-column">
          <li class="nav-item"><a class="nav-link active" href="#"><i class="bi bi-speedometer2"></i> Dashboard</a></li>
          <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-file-earmark"></i> Reports</a></li>
          <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-people"></i> Users</a></li>
          <li class="nav-item"><a class="nav-link" href="#"><i class="bi bi-gear"></i> Settings</a></li>
        </ul>
      </div>
    </nav>

    <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">Dashboard</h1>
        <div class="btn-toolbar mb-2 mb-md-0">
          <button type="button" class="btn btn-sm btn-outline-primary">Export</button>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-md-3">
          <div class="card text-bg-primary">
            <div class="card-body">
              <h5 class="card-title">Users</h5>
              <p class="card-text display-6">1,234</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-bg-success">
            <div class="card-body">
              <h5 class="card-title">Revenue</h5>
              <p class="card-text display-6">$5,678</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-bg-warning">
            <div class="card-body">
              <h5 class="card-title">Orders</h5>
              <p class="card-text display-6">89</p>
            </div>
          </div>
        </div>
      </div>

      <div class="my-4">
        <table class="table table-striped">
          <thead>
            <tr><th>#</th><th>Name</th><th>Email</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>John</td><td>john@example.com</td><td><span class="badge bg-success">Active</span></td></tr>
            <tr><td>2</td><td>Jane</td><td>jane@example.com</td><td><span class="badge bg-warning">Pending</span></td></tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</div>`,
};

export function generateComponent(component: string, description?: string): string {
  const key = component.toLowerCase().replace(/\s+/g, '-');
  const template = componentTemplates[key] || componentTemplates[component.toLowerCase()];

  if (template) {
    const html = template('');
    if (description) {
      return `<!-- ${description} -->\n${html}`;
    }
    return html;
  }

  return `<!-- No built-in template for "${component}". Try one of: ${Object.keys(componentTemplates).join(', ')} -->
<!-- Or describe your needs to generate custom HTML -->`;
}

export function generateLayout(layout: string, description?: string): string {
  const key = layout.toLowerCase().replace(/\s+/g, '-');
  const html = layoutTemplates[key] ?? layoutTemplates['full-page'];

  if (description) {
    return `<!-- ${description} -->\n${html}`;
  }
  return html;
}

export function generateCustomCSS(request: string): string {
  return `/* Custom CSS generated for: ${request} */

/* Example: Add your custom styles below */

/* Custom button */
.btn-custom {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 50px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-custom:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  color: white;
}

/* Hero section with gradient background */
.hero-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* Card hover effect */
.card-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

/* Responsive typography */
@media (max-width: 768px) {
  :root {
    --bs-body-font-size: 0.95rem;
  }
  
  .display-1, .display-2, .display-3 {
    font-size: calc(1.5rem + 2vw);
  }
}

/* Section spacing */
.section-padding {
  padding: 5rem 0;
}

@media (max-width: 768px) {
  .section-padding {
    padding: 3rem 0;
  }
}`;
}

export function generateCustomJS(request: string): string {
  return `// Custom JavaScript generated for: ${request}

document.addEventListener('DOMContentLoaded', function() {

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Navbar scroll effect
  let lastScroll = 0;
  const navbar = document.querySelector('.navbar');
  
  if (navbar) {
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        navbar.classList.add('navbar-scrolled', 'shadow-sm');
      } else {
        navbar.classList.remove('navbar-scrolled', 'shadow-sm');
      }
      
      lastScroll = currentScroll;
    });
  }

  // Bootstrap form validation
  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });

  // Tooltip initialization
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Back to top button
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });

    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});`;
}

export function compareBootstrapVersions(className: string): string {
  const mappings: Record<string, string> = {
    'mr-': 'me-',
    'ml-': 'ms-',
    'pr-': 'pe-',
    'pl-': 'ps-',
    'font-weight-': 'fw-',
    'font-italic': 'fst-italic',
    'text-left': 'text-start',
    'text-right': 'text-end',
    'float-left': 'float-start',
    'float-right': 'float-end',
    'rounded-left': 'rounded-start',
    'rounded-right': 'rounded-end',
    'border-left': 'border-start',
    'border-right': 'border-end',
    'no-gutters': 'g-0',
    'badge-pill': 'rounded-pill',
    'form-group': 'mb-3',
    'form-row': 'row g-2',
    'form-inline': 'd-flex',
    'close': 'btn-close',
    'sr-only': 'visually-hidden',
    'sr-only-focusable': 'visually-hidden-focusable',
  };

  const results: string[] = [];
  let found = false;

  for (const [bs4, bs5] of Object.entries(mappings)) {
    if (className.includes(bs4)) {
      const suggested = className.replace(bs4, bs5);
      results.push(`${className} -> ${suggested} (ms -> me, ml -> ms etc.)`);
      found = true;
    }
  }

  if (!found) {
    return `No Bootstrap 4->5 migration found for "${className}". It may be the same in both versions, or it may be a Bootstrap 5 class.`;
  }

  return `Bootstrap 4 to 5 migration for "${className}":\n${results.join('\n')}`;
}

export const availableComponents = Object.keys(componentTemplates).sort();
export const availableLayouts = Object.keys(layoutTemplates).sort();
