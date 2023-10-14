import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import axios from 'axios';
//import icons
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { Blog as NewBlogIcon} from '@styled-icons/icomoon/Blog';
import { Blogger as BlogIcon } from '@styled-icons/boxicons-logos/Blogger';
import { Comment as CommentIcon } from '@styled-icons/boxicons-regular/Comment';
import { Category as CategoryIcon } from '@styled-icons/boxicons-regular/Category';
import { Tags as TagIcon } from '@styled-icons/bootstrap/Tags';
import { Link as LinkIcon } from '@styled-icons/entypo/Link';

export default function DashBoard({setSelectedSidebarItem, setSelectedContentItem }) {
  // get session data from sessionContext
  const [categoryCount, setCategoryCount]=useState(0);
  const [blogCount, setBlogCount]=useState(0);
  const [linkCount, setLinkCount]=useState(0);
  const [tagCount, setTagCount]=useState(0);
  const [commentCount, setCommentCount]=useState(0);
  // get all blogs from database
  const refreshData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}dashboard`, {
        params: {
          user: JSON.parse(sessionStorage.getItem("user")).user
        }
      });
      console.log(response)
      if (response.status === 200) {
          setCategoryCount(response.data.categoryCount);
          setBlogCount(response.data.blogCount);
          setLinkCount(response.data.linkCount);
          setTagCount(response.data.tagCount);
          setCommentCount(response.data.commentCount);
      }
    } catch (error) {
      console.error('refresh data error:', error);
    }
  };
  
  useEffect(() => {
    // eslint-disable-next-line
    let isMounted = true;
    refreshData();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, []);
  const handleCard1Click = () => {
    setSelectedSidebarItem('NewBlog');
    setSelectedContentItem('NewBlog');
  };

  const handleCard2Click = () => {
    setSelectedSidebarItem('BlogMng');
    setSelectedContentItem('BlogMng');
  };

  const handleCard3Click = () => {
    setSelectedSidebarItem('CommentMng');
    setSelectedContentItem('CommentMng');
  };

  const handleCard4Click = () => {
    setSelectedSidebarItem('CategoryMng');
    setSelectedContentItem('CategoryMng');
  };

  const handleCard5Click = () => {
    setSelectedSidebarItem('TagMng');
    setSelectedContentItem('TagMng');
  };

  const handleCard6Click = () => {
    setSelectedSidebarItem('LinkMng');
    setSelectedContentItem('LinkMng');
  };

  const cardData = [
    {
      id: "card1",
      firstLine: "New Blog",
      secondLine: "Capturing Your Thoughts",
      thirdLine: "Let's Goooooo",
      icon: <NewBlogIcon />,
      onClick: () => handleCard1Click(),
      bgColor1: "#3ba2b9",
      bgColor2: "#3591a6",
    },
    {
      id: "card2",
      firstLine: blogCount,
      secondLine: "Total Blogs",
      thirdLine: "More Info",
      icon: <BlogIcon />,
      onClick: () => handleCard2Click(),
      bgColor1: "#40a73f",
      bgColor2: "#399639",
    },
    {
      id: "card3",
      firstLine: commentCount,
      secondLine: "Total Comments",
      thirdLine: "More Info",
      icon: <CommentIcon />,
      onClick: () => handleCard3Click(),
      bgColor1: "#2f7cff",
      bgColor2: "#2a6fe5",
    },
    {
      id: "card4",
      firstLine: categoryCount - 1 >= 0 ? categoryCount - 1 : 0,
      secondLine: "Total Categories",
      thirdLine: "More Info",
      icon: <CategoryIcon />,
      onClick: () => handleCard4Click(),
      bgColor1: "#f9c000",
      bgColor2: "#e0ac00",
    },
    {
      id: "card5",
      firstLine: tagCount,
      secondLine: "Total Tags",
      thirdLine: "More Info",
      icon: <TagIcon />,
      onClick: () => handleCard5Click(),
      bgColor1: "#d33242",
      bgColor2: "#bd2d3b",
    },
    {
      id: "card6",
      firstLine: linkCount,
      secondLine: "Total Links",
      thirdLine: "More Info",
      icon: <LinkIcon />,
      onClick: () => handleCard6Click(),
      bgColor1: "#353a40",
      bgColor2: "#303439",
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
      {cardData.map((card) => (
        <Card key={card.id} sx={{ width: "32%", height: "150px", borderRadius: 0, marginBottom: "20px", boxShadow: "none", position: "relative" }}>
            <Box sx={{ width: "100%", height: "100%", backgroundColor: "#E3F2FD", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <Box sx={{ width: "100%", height: "80%", display: "flex" }}>
                <Box sx={{ width: "66.66%", backgroundColor: card.bgColor1, padding: "8px" }}>
                <Typography component="div" fontWeight={"bold"} fontSize={"40px"} color="white">
                  {card.firstLine}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="white" >
                  {card.secondLine}
                </Typography>
                </Box>
                <Box sx={{ width: "33.33%", backgroundColor: card.bgColor1, padding: "8px", color: "rgba(230, 230, 230, 0.8)" }}>
                  {React.cloneElement(card.icon, { style: { color: "rgba(230, 230, 230, 0.8)" } })}
                </Box>
              </Box>
              <Box sx={{ width: "100%", height: "20%", backgroundColor: card.bgColor2, padding: "8px", display: "flex", alignItems: "center", justifyContent: "center"  }}>
                <Typography 
                  variant="body1"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  color="white"
                  onClick={card.onClick}
                >
                  {card.thirdLine}
                  <ArrowCircleRightIcon />
                </Typography>
              </Box>
            </Box>
        </Card>
      ))}
    </Box>
  );
}
