import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Footer from './Footer'
import Header from './Header'
import Elevator from './Elevator';
import axios from 'axios'
import Avatar from '@mui/material/Avatar';
import Pagination from '@mui/material/Pagination';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import icon from '../../assets/images/blogging.png'

const BlogTitle = styled.h2`
  margin-left: '10px'; 
  margin-top: '10px'; 
  padding: '0'; 
  color: inherit; 
  text-decoration: none;
  transition: color 0.3s;
  &:hover {
    color: #008000;
  }
`;

export default function Blog() {
  document.body.style.margin='0';
  document.body.style.padding='0';
  const { author } = useParams();
  const navigate = useNavigate();
  const [footerAbout, setFooterAbout] = useState('');
  const [footerCopyRight, setFooterCopyRight] = useState('');
  const [footerPoweredBy, setFooterPoweredBy] = useState('');
  const [footerPoweredByUrl, setFooterPoweredByUrl] = useState('');
  const [footerGithub, setFooterGithub] = useState('');
  const [footerFacebook, setFooterFacebook] = useState('');
  const [footerX, setFooterX] = useState('');
  const [footerInstagram, setFooterInstagram] = useState('');
  const [websiteTitle, setWebsiteTitle] = useState('');
  const [websiteIcon, setWebsiteIcon] = useState();
  const [github, setGithub] = useState('');
  const [blogList, setBlogList] = useState([]);
  const [blogCoverList, setBlogCoverList] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [tagListWithCount, setTagListWithCount] = useState();
  const [authorName, setAuthorName] = useState('');
  const [authorProfilePic, setAuthorProfilePic] = useState();
  const [authorEmail, setAuthorEmail] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  //get all data from database
  const refreshData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}blog-index`, {
        params: {
          author: author
        }
      });
      console.log(response);
      if (response.status === 200) {
        setFooterAbout(response.data.footerConfig.footerAbout);
        setFooterCopyRight(response.data.footerConfig.footerCopyRight);
        setFooterPoweredBy(response.data.footerConfig.footerPoweredBy);
        setFooterPoweredByUrl(response.data.footerConfig.footerPoweredByUrl);
        setFooterGithub(response.data.websiteConfig.github);
        setFooterFacebook(response.data.websiteConfig.facebook);
        setFooterX(response.data.websiteConfig.x);
        setFooterInstagram(response.data.websiteConfig.instagram);
        setWebsiteTitle(response.data.siteConfig.websiteTitle);
        setWebsiteIcon(response.data.siteIcon);
        setGithub(response.data.github);
        setBlogList(response.data.blogList);
        setBlogCoverList(response.data.blogCoverList);
        setTagList(response.data.tagList);
        setAuthorName(response.data.authorName);
        setAuthorProfilePic(response.data.authorProfilePic);
        setAuthorEmail(response.data.authorEmail);
      }
    } catch (error) {
      console.error('refresh data error:', error);
    }
  };
  useEffect(() => {
    // eslint-disable-next-line
    let isMounted = true;
    refreshData();
    window.scrollTo(0, 0);
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, []);
  const[filteredBlogs, setFilteredBlogs] = useState([]);
  useEffect(() => {
    setFilteredBlogs(blogList);
  },[blogList])

  const handleSearch = () => {
    const filteredRows = blogList.filter((row) => {
      return row.blogTitle.toString().toLowerCase().includes(searchKeyword.toLowerCase()) ||
             row.blogCategoryName.toString().toLowerCase().includes(searchKeyword.toLowerCase());
    });
    setFilteredBlogs(filteredRows);
  };

  const handleTagClick = (tagName) => {
    const filteredRows = blogList.filter((row) => {
      return row.blogTags.toString().includes(tagName);
    });
    setFilteredBlogs(filteredRows);
  };

  const handleCategoryClick = (categoryName) => {
    const filteredRows = blogList.filter((row) => {
      return row.blogCategoryName.toString().includes(categoryName);
    });
    setFilteredBlogs(filteredRows);
  };

  const handleBlogEntryClick = (blogId, blogSubUrl) =>{
    handleViewIncrease(blogId);
    navigate(`/blog/${author}/blog-detail/${blogSubUrl}`);
  }
  // pagination config
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // page change for pagination
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const tagCount = {};
    blogList.forEach(blog => {
      const tagsArray = blog.blogTags.split(',');
      tagsArray.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    setTagListWithCount(tagList.map(tag => ({
      ...tag,
      count: tagCount[tag.tagName] || 0
    })));
  },[tagList, blogList]);

  const handleViewIncrease = async(blogId) => {
    const formData = new FormData();
    formData.append("blogId", blogId);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}view-increase`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      console.log(response);
    } catch (error) {
      console.error('add error:', error);
    }
  }

  return (
    <Box sx={{ height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
      <Helmet>
        <title>{websiteTitle}</title>
        {websiteIcon === undefined ? <link rel="icon" href={icon} /> : 
        <link rel="icon" href={`data:image/png;base64,${websiteIcon}`} />}
      </Helmet>
      <Header indexPage={`/blog/${author}`} linkPage={`/blog/${author}/links`} githubPage={github}/>
      <Box sx={{ display: 'flex'}}>
        <Box sx={{ flex: 7, borderRight: '1px solid #ccc', padding: '8px' }}>
        {filteredBlogs
          .slice()
          .sort((a, b) => {
            const dateA = new Date(a['updateTime']);
            const dateB = new Date(b['updateTime']);
            return dateB - dateA;
          })
          .slice(startIndex, endIndex)
          .map((blog) => {
            const updateTime = new Date(blog.updateTime);
            const formattedTime = updateTime.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });      
            return(
              <div key={blog.blogId} style={{marginBottom: '10px', borderBottom: '1px solid #ccc'}}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={authorProfilePic ? `data:image/*;base64,${authorProfilePic}` : null} sx={{ width: 30, height: 30, margin: 1 }} />
                    <span>
                      <span style={{ color: '#000080' }}>{authorName}</span>
                      <span style={{ color: '#ccc' }}> in </span>
                      <span onClick={() => handleCategoryClick(blog.blogCategoryName)} style={{ color: '#000080', cursor: 'pointer' }}>{blog.blogCategoryName}</span>
                    </span>
                  </div>
                  <span style={{ color: '#ccc' }}>{formattedTime}</span>
                </div>
                <Link to={{
                  pathname:`/blog/${author}/blog-detail/${blog.blogSubUrl ? blog.blogSubUrl : blog.blogId}`
                  }} 
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  onClick={() => handleViewIncrease(blog.blogId)}
                >
                  <BlogTitle>
                    {blog.blogTitle}
                  </BlogTitle>
                  <img
                    src={`data:image/*;base64,${blogCoverList[blog.blogCoverImage]}`}
                    alt="blog-cover"
                    style={{ maxWidth: '200px', maxHeight: '240px', marginBottom: '10px' }}
                  />
                </Link>
              </div>
            )
        })}
        </Box>
        <Box sx={{ flex: 3, padding: '8px' }}>
          <Box sx={{marginBottom: '30px'}}>
            <Typography 
              variant="subtitle1" 
              sx={{fontWeight: 'bold', 
                  paddingBottom: '6px', 
                  paddingTop: '20px',  
                  borderBottom: '1px solid #ccc',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    width: '30%',
                    height: '1px',
                    background: 'black'
                  }
                }}
            >
              Search by Title or Category
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'left', justifyContent: 'left', marginTop: '20px' }}>
              <TextField
                label="Search"
                variant="outlined"
                size="small"
                sx={{ width: '250px', margin: '2px' }}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <IconButton onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{marginBottom: '30px'}}>
            <Typography 
              variant="subtitle1" 
              sx={{fontWeight: 'bold', 
                  paddingBottom: '6px', 
                  paddingTop: '20px',  
                  borderBottom: '1px solid #ccc',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    width: '30%',
                    height: '1px',
                    background: 'black'
                  }
                }}
            >
              Trending Tags
            </Typography>
            {tagListWithCount && <Grid container spacing={1} sx={{marginTop: '20px'}}>
              {tagListWithCount
                .filter(tag => tag.count > 0)
                .sort((a, b) => {
                  return b.count - a.count;
                })
                .map((tag) => (
                  <Grid item key={tag.tagId}>
                    <Chip onClick={() => handleTagClick(tag.tagName)} label={`${tag.tagName}(${tag.count})`} />
                  </Grid>
                ))}
            </Grid>}
          </Box>
          <Box sx={{marginBottom: '30px'}}>
            <Typography 
              variant="subtitle1" 
              sx={{fontWeight: 'bold', 
                  paddingBottom: '6px', 
                  paddingTop: '20px',  
                  borderBottom: '1px solid #ccc',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    width: '30%',
                    height: '1px',
                    background: 'black'
                  }
                }}
            >
              Most Viewed
            </Typography>
            {blogList && <Grid container sx={{marginTop: '20px', width: '100%'}}>
              {blogList
                .sort((a, b) => {
                  return b.blogViews - a.blogViews;
                })
                .slice(0, 5)
                .map((blog) => (
                  <Grid item onClick={() => handleBlogEntryClick(blog.blogId, blog.blogSubUrl)} style={{ cursor: 'pointer' }} key={blog.blogId} sx={{ display: 'flex', justifyContent: 'space-between', width: '90%' }}>
                    <Typography
                      sx={{
                        fontSize: 'small',
                        maxWidth: '250px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Tooltip title={<span>{blog.blogTitle}</span>}>
                        <span>{blog.blogTitle}</span>
                      </Tooltip>
                    </Typography>
                    <Typography sx={{ fontSize: 'small' }}>
                      <span>{blog.blogViews}</span>
                    </Typography>
                  </Grid>
                ))}
            </Grid>}
          </Box>
          <Box sx={{marginBottom: '30px'}}>
            <Typography 
              variant="subtitle1" 
              sx={{fontWeight: 'bold', 
                  paddingBottom: '6px', 
                  paddingTop: '20px',  
                  borderBottom: '1px solid #ccc',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    width: '30%',
                    height: '1px',
                    background: 'black'
                  }
                }}
            >
             Latest Posts
            </Typography>
            {blogList && <Grid container sx={{marginTop: '20px', width: '100%'}}>
              {blogList
                .sort((a, b) => {
                  const dateA = new Date(a['updateTime']);
                  const dateB = new Date(b['updateTime']);
                  return dateB - dateA;
                })
                .slice(0, 5)
                .map((blog) => {
                  const updateTime = new Date(blog.updateTime);
                  const formattedTime = updateTime.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
                  return(
                    <Grid item onClick={() => handleBlogEntryClick(blog.blogId, blog.blogSubUrl)} style={{ cursor: 'pointer' }} key={blog.blogId} sx={{ display: 'flex', justifyContent: 'space-between', width: '90%' }}>
                    <Typography
                      sx={{
                        fontSize: 'small',
                        maxWidth: '250px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Tooltip title={<span>{blog.blogTitle}</span>}>
                        <span>{blog.blogTitle}</span>
                      </Tooltip>
                    </Typography>
                    <Typography sx={{ fontSize: 'small' }}>
                      <span>{formattedTime}</span>
                    </Typography>
                  </Grid>
                  ) 
                })}
            </Grid>}
          </Box>
        </Box>
      </Box>
      <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
      <Elevator authorEmail={authorEmail}/>
      <Footer about={footerAbout} copyRight={footerCopyRight} poweredBy={footerPoweredBy} poweredByUrl={footerPoweredByUrl} footerGithub={footerGithub} footerFacebook={footerFacebook} footerX={footerX} footerInstagram={footerInstagram}/>
    </Box>
  );
}