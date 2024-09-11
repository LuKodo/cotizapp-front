import { Outlet } from 'react-router-dom';
import { Menu } from './Menu';

const Layout = () => {
  return (
    <div id='main-wrapper' style={{ minHeight: '100vh' }}>
      <aside className='left-sidebar with-vertical'>
        <Menu />
      </aside>

      <div className='page-wrapper'>
        <div className='body-wrapper px-4'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
