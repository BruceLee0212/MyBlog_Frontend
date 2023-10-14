import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

const Header = ({indexPage, linkPage, githubPage}) => {
  
  return (
    <div className='blog-header'>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: 'none' }}>
        {indexPage && <Link href={indexPage} underline="none">
          <Button size="small" sx={{ fontWeight: 'bold', fontSize: '15px', color: 'white' }}>MyBlog</Button>
        </Link>}  
        <div style={{ display: 'flex', gap: '10px' }}>
          {linkPage && <Link href={linkPage} underline="none">
            <Button size="small" sx={{ fontWeight: 'bold', fontSize: '15px', color: 'white' }}>Link</Button>
          </Link>}
          {githubPage && <Link href={githubPage} underline="none">
            <Button size="small" sx={{ fontWeight: 'bold', fontSize: '15px', color: 'white' }}>Github</Button>
          </Link>}
        </div>
      </Toolbar>

    </div>
  );
}

export default Header;