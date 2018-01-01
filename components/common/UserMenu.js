


export default () => (<div className="dropdown">

  <a className="nav-link dropdown-toggle cursor" data-toggle="dropdown">
    Login
  </a>

  <div className="dropdown-menu dropdown-menu-right bg-light">

    <form className="px-4 py-3">
      <div className="form-group">
        <input type="email" className="form-control" id="exampleDropdownFormEmail1" placeholder="email@example.com" />
      </div>
      <div className="form-group">
        <input type="password" className="form-control" id="exampleDropdownFormPassword1" placeholder="Password" />
      </div>
      <div className="d-flex flex-row-reverse">
      <a className="btn btn-warning" data-toggle="dropdown">
        Login
      </a>
      </div>
    </form>

    {/*<a className="dropdown-item" href="#">Settings</a>
    <div className="dropdown-divider"></div>
    <a className="dropdown-item" href="#">Logout</a>*/}
  </div>

  <style jsx>{`
    .dropdown-menu {
      width: 300px;
    }
    .dropdown-toggle::after {
      display: none;
    }
  `}</style>
  
</div>)