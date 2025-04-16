import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Paper, 
  Card, 
  CardContent, 
  Button, 
  CircularProgress, 
  Chip, 
  Divider, 
  LinearProgress,
  Grid,
  Stack,
  useTheme,
  alpha
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SpeedIcon from '@mui/icons-material/Speed';
import CampaignIcon from '@mui/icons-material/Campaign';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import aiService from '../../services/aiService';
import exampleVenueData from '../../data/exampleVenueData';

const AIInsights = () => {
  const theme = useTheme();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [analysisStage, setAnalysisStage] = useState(0);
  const [progressMessage, setProgressMessage] = useState('Initializing analysis...');
  
  // Function to update progress during loading
  const updateProgress = useCallback(() => {
    const stages = [
      { stage: 1, message: 'Collecting Bondfyr check-in data...' },
      { stage: 2, message: 'Analyzing attendance patterns...' },
      { stage: 3, message: 'Processing promoter performance...' },
      { stage: 4, message: 'Evaluating check-in efficiency...' },
      { stage: 5, message: 'Identifying operational improvements...' },
      { stage: 6, message: 'Generating actionable recommendations...' },
      { stage: 7, message: 'Finalizing analysis...' }
    ];
    
    let currentStage = 0;
    
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setAnalysisStage(stages[currentStage].stage);
        setProgressMessage(stages[currentStage].message);
        currentStage++;
      } else {
        clearInterval(interval);
      }
    }, 800);
    
    return interval;
  }, []);
  
  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    setInsights(null);
    setAnalysisStage(0);
    setProgressMessage('Initializing analysis...');
    
    // Start the progress updates
    const progressInterval = updateProgress();
    
    try {
      // In production, API key should come from environment variables or secure storage
      // For development, we'll use a mock service without requiring an actual key
      
      // Add timeout for fetch operation
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out. The server took too long to respond.')), 30000);
      });
      
      // Call the AI service with timeout
      const result = await Promise.race([
        aiService.generateAIInsights(exampleVenueData),
        timeoutPromise
      ]);
      
      // Set the first category as selected by default if available
      if (result && result.categories && result.categories.length > 0) {
        setSelectedCategory(result.categories[0].id);
      }
      
      setInsights(result);
    } catch (err) {
      console.error('Error fetching AI insights:', err);
      
      // Categorize errors
      if (err.message.includes('API key')) {
        setError({
          type: 'api_key',
          message: 'API key error: ' + err.message
        });
      } else if (err.message.includes('rate limit')) {
        setError({
          type: 'rate_limit',
          message: 'Rate limit exceeded. Please try again later.'
        });
      } else if (err.message.includes('timed out') || err.message.includes('timeout')) {
        setError({
          type: 'timeout',
          message: 'The request timed out. Please check your internet connection and try again.'
        });
      } else if (err.message.includes('network') || err.message.includes('fetch') || err.message.includes('connection')) {
        setError({
          type: 'network',
          message: 'Network error. Please check your internet connection and try again.'
        });
      } else {
        setError({
          type: 'general',
          message: err.message || 'An error occurred while generating insights.'
        });
      }
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
    }
  }, [updateProgress]);
  
  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };
  
  // Helper to determine trend icon
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon color="success" />;
      case 'down':
        return <TrendingDownIcon color="error" />;
      default:
        return <TrendingFlatIcon color="warning" />;
    }
  };
  
  // Get category icon
  const getCategoryIcon = (categoryId) => {
    switch (categoryId) {
      case 'attendance':
        return <PeopleIcon />;
      case 'revenue':
        return <AttachMoneyIcon />;
      case 'operations':
        return <SpeedIcon />;
      case 'marketing':
        return <CampaignIcon />;
      default:
        return <BarChartIcon />;
    }
  };

  // Get impact color
  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  // Get effort color
  const getEffortColor = (effort) => {
    switch (effort) {
      case 'low':
        return theme.palette.success.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'high':
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };
  
  // Get active category based on tab and selection
  const getActiveCategory = () => {
    if (!insights || !insights.categories) return null;
    
    if (tabValue === 0 && selectedCategory) {
      return insights.categories.find(cat => cat.id === selectedCategory) || null;
    }
    
    return null;
  };
  
  // Render loading state
  if (loading) {
    const progressPercentage = (analysisStage / 7) * 100;
    
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>Bondfyr AI Insights</Typography>
        <Paper 
          elevation={4} 
          sx={{ 
            p: 5, 
            borderRadius: 3,
            bgcolor: alpha(theme.palette.primary.main, 0.03),
            backgroundImage: `radial-gradient(${alpha(theme.palette.primary.light, 0.15)} 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        >
          <Typography variant="h6" color="primary.main" sx={{ mb: 4, fontWeight: 600 }}>
            Analyzing your venue data... This may take a moment.
          </Typography>
          
          <Box sx={{ width: '100%', mb: 4 }}>
            <LinearProgress 
              variant="determinate" 
              value={progressPercentage} 
              sx={{ 
                height: 10, 
                borderRadius: 5,
                bgcolor: alpha(theme.palette.primary.main, 0.15),
                '& .MuiLinearProgress-bar': {
                  bgcolor: theme.palette.primary.main,
                  backgroundImage: `linear-gradient(90deg, ${alpha(theme.palette.primary.light, 0.8)}, ${theme.palette.primary.main})`,
                  transition: 'transform 0.4s ease'
                }
              }} 
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
            <CircularProgress 
              size={70} 
              thickness={4} 
              sx={{
                color: theme.palette.primary.main,
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }}
            />
            <Box sx={{ ml: 3, textAlign: 'left' }}>
              <Typography variant="body1" fontWeight="bold" sx={{ mb: 0.5 }}>
                {progressMessage}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round(progressPercentage)}% complete
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 3, fontStyle: 'italic' }}>
            Using Bondfyr's check-in and operational data to generate actionable insights for your venue
          </Typography>
        </Paper>
      </Box>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>Bondfyr AI Insights</Typography>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            bgcolor: error.type === 'network' || error.type === 'timeout' ? alpha(theme.palette.warning.main, 0.1) : alpha(theme.palette.error.main, 0.1), 
            borderRadius: 2,
            mb: 3 
          }}
        >
          <Typography variant="h6" fontWeight="bold" color={error.type === 'network' || error.type === 'timeout' ? 'warning.main' : 'error.main'}>
            {error.type === 'api_key' ? 'API Configuration Error' : 
             error.type === 'rate_limit' ? 'Rate Limit Exceeded' :
             error.type === 'network' ? 'Network Error' :
             error.type === 'timeout' ? 'Request Timeout' : 'Analysis Error'}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>{error.message}</Typography>
          
          {error.type === 'api_key' && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" fontWeight="medium">
                To use AI Insights, please ensure your Bondfyr API configuration is correct:
              </Typography>
              <Box
                component="pre"
                sx={{
                  bgcolor: 'background.paper',
                  p: 2,
                  mt: 1,
                  borderRadius: 1,
                  fontSize: '0.875rem',
                  overflowX: 'auto',
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                REACT_APP_BONDFYR_API_KEY=[your-api-key]
              </Box>
            </Box>
          )}
          
          {(error.type === 'network' || error.type === 'timeout') && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" fontWeight="medium">
                This could be due to:
              </Typography>
              <ul>
                <li>Poor internet connection</li>
                <li>Temporary server outage</li>
                <li>Firewall or security settings blocking the request</li>
              </ul>
            </Box>
          )}
          
          <Button
            variant="contained"
            color={error.type === 'network' || error.type === 'timeout' ? 'warning' : 'primary'}
            startIcon={<RefreshIcon />}
            onClick={fetchInsights}
            sx={{ mt: 3 }}
          >
            Try Again
          </Button>
        </Paper>
        <Typography variant="body2" color="text.secondary">
          {error.type === 'api_key' ? 
            'If you need help with your API configuration, please contact Bondfyr support.' :
            'If the issue persists, please contact Bondfyr support.'}
        </Typography>
      </Box>
    );
  }
  
  // Render when no insights
  if (!insights) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>Bondfyr AI Insights</Typography>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 5, 
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.05)
          }}
        >
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            No insights available. Please try generating insights for your venue.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<RefreshIcon />}
            onClick={fetchInsights}
          >
            Generate Insights
          </Button>
        </Paper>
      </Box>
    );
  }
  
  const activeCategory = getActiveCategory();
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h5" fontWeight="bold">Bondfyr AI Insights</Typography>
        <Chip 
          label="Powered by AI" 
          color="primary" 
          size="small" 
          sx={{ 
            borderRadius: 1.5, 
            fontWeight: 'medium', 
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            color: 'white',
            '& .MuiChip-label': { px: 2 }
          }}
        />
      </Box>
      
      {/* Performance Overview */}
      <Paper 
        elevation={4} 
        sx={{ 
          mb: 4, 
          position: 'relative', 
          overflow: 'hidden',
          borderRadius: 3,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
          }
        }}
      >
        <Grid container>
          <Grid item xs={12} md={4} 
            sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: 'white',
              p: 4,
              borderTopLeftRadius: 12,
              borderBottomLeftRadius: { xs: 0, md: 12 },
              borderTopRightRadius: { xs: 12, md: 0 },
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                background: 'radial-gradient(circle at bottom right, rgba(255,255,255,0.1) 0%, transparent 70%)',
                pointerEvents: 'none'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  borderRadius: '50%',
                  width: 70,
                  height: 70,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  border: '4px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                <Typography variant="h3" fontWeight="bold">{insights.summary.score}</Typography>
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: 0.5 }}>Venue Score</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <TrendingUpIcon sx={{ fontSize: 18, mr: 0.5 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Potential Growth: {insights.summary.potentialIncrease}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ mb: 3, opacity: 0.92, lineHeight: 1.6 }}>
              Your venue is performing well, with room for strategic improvements.
            </Typography>
            <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', my: 2 }} />
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}>
              <LightbulbIcon sx={{ mr: 1.5, fontSize: 20 }} />
              {insights.summary.actionItems} actionable recommendations
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={8} sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, ml: 1 }}>
              Performance Metrics
            </Typography>
            <Grid container spacing={2.5}>
              {insights.weeklyReport.performanceMetrics.map((metric, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      height: '100%',
                      borderRadius: 3,
                      borderColor: 'transparent',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
                        transform: 'translateY(-3px)'
                      },
                      background: alpha(theme.palette.background.paper, 0.7),
                      backdropFilter: 'blur(8px)'
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight="medium" sx={{ display: 'block', mb: 0.5 }}>
                        {metric.name}
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {metric.value}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <Typography 
                          variant="caption"
                          color={metric.status === 'positive' ? 'success.main' : 'error.main'}
                          fontWeight="bold"
                          sx={{ mr: 0.5 }}
                        >
                          {metric.change}
                        </Typography>
                        {metric.status === 'positive' ? 
                          <TrendingUpIcon sx={{ fontSize: 16 }} color="success" /> : 
                          <TrendingDownIcon sx={{ fontSize: 16 }} color="error" />
                        }
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Tab Navigation */}
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange}
        sx={{
          mb: 3,
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: 1.5
          },
          '& .MuiTab-root': {
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem',
            minWidth: 100,
            transition: 'all 0.2s',
            '&.Mui-selected': {
              color: theme.palette.primary.main
            }
          }
        }}
      >
        <Tab label="Category Insights" />
        <Tab label="Weekly Report" />
      </Tabs>
      
      {/* Category Insights Tab */}
      {tabValue === 0 && (
        <>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1.5, 
            mb: 4,
            '& .MuiChip-root': {
              borderRadius: 3,
              fontWeight: 'medium',
              px: 1,
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }
          }}>
            {insights.categories.map((category) => (
              <Chip
                key={category.id}
                label={`${category.name} (${category.score})`}
                icon={getCategoryIcon(category.id)}
                variant={selectedCategory === category.id ? "filled" : "outlined"}
                color={selectedCategory === category.id ? "primary" : "default"}
                onClick={() => handleCategoryChange(category.id)}
                sx={{ 
                  pl: 0.5,
                  boxShadow: selectedCategory === category.id ? '0 4px 8px rgba(0,0,0,0.1)' : 'none'
                }}
              />
            ))}
          </Box>
          
          {activeCategory && (
            <Box sx={{ 
              opacity: 1, 
              transform: 'translateY(0)', 
              transition: 'opacity 0.3s, transform 0.3s'
            }}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3.5, 
                  mb: 3,
                  borderRadius: 3,
                  background: `linear-gradient(to bottom, ${alpha(theme.palette.background.paper, 0.98)}, ${theme.palette.background.paper})`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: 2,
                    px: 2,
                    py: 1
                  }}>
                    {getCategoryIcon(activeCategory.id)}
                    <Typography variant="h6" fontWeight="bold" sx={{ ml: 1.5 }}>{activeCategory.name}</Typography>
                    {getTrendIcon(activeCategory.trend)}
                  </Box>
                  <Box sx={{ ml: 'auto' }}>
                    <Chip
                      label={`Score: ${activeCategory.score}/100`}
                      color={activeCategory.score > 75 ? "success" : activeCategory.score > 50 ? "warning" : "error"}
                      sx={{ 
                        borderRadius: 2, 
                        fontWeight: 'bold',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                      }}
                    />
                  </Box>
                </Box>
                
                <Divider sx={{ mb: 3, mt: 2 }} />
                
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2.5, display: 'flex', alignItems: 'center' }}>
                  <LightbulbIcon sx={{ mr: 1.5, color: theme.palette.warning.main }} />
                  Key Insights
                </Typography>
                
                <Grid container spacing={2.5}>
                  {activeCategory.insights.map((insight, index) => (
                    <Grid item xs={12} key={index}>
                      <Card 
                        variant="outlined" 
                        sx={{ 
                          bgcolor: 'background.paper',
                          borderRadius: 3,
                          borderColor: alpha(theme.palette.primary.main, 0.1),
                          transition: 'all 0.25s ease',
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                            transform: 'translateY(-3px)',
                            boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.12)}`
                          }
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, alignItems: 'flex-start' }}>
                            <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                              {insight.title}
                            </Typography>
                            <Stack direction="row" spacing={1.5}>
                              <Chip
                                label={`Impact: ${insight.impact}`}
                                size="small"
                                sx={{ 
                                  bgcolor: alpha(getImpactColor(insight.impact), 0.1), 
                                  color: getImpactColor(insight.impact),
                                  fontWeight: 'bold',
                                  borderRadius: 1.5,
                                  border: `1px solid ${alpha(getImpactColor(insight.impact), 0.2)}`
                                }}
                              />
                              <Chip
                                label={`Effort: ${insight.effort}`}
                                size="small"
                                sx={{ 
                                  bgcolor: alpha(getEffortColor(insight.effort), 0.1), 
                                  color: getEffortColor(insight.effort),
                                  fontWeight: 'bold',
                                  borderRadius: 1.5,
                                  border: `1px solid ${alpha(getEffortColor(insight.effort), 0.2)}`
                                }}
                              />
                            </Stack>
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {insight.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Box>
          )}
        </>
      )}
      
      {/* Weekly Report Tab */}
      {tabValue === 1 && insights.weeklyReport && (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3.5, 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
            }
          }}
        >
          <Typography variant="h6" fontWeight="bold" color="primary.main">
            {insights.weeklyReport.title}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mb: 3 }}>{insights.weeklyReport.date}</Typography>
          
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <TrendingUpIcon sx={{ mr: 1.5, color: theme.palette.success.main }} />
            Highlights
          </Typography>
          
          <Box 
            sx={{ 
              p: 2.5, 
              mb: 4, 
              borderRadius: 3, 
              bgcolor: alpha(theme.palette.success.main, 0.05),
              border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
              backgroundImage: `radial-gradient(${alpha(theme.palette.success.light, 0.1)} 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}
          >
            <Grid container spacing={2.5}>
              {insights.weeklyReport.highlights.map((highlight, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.success.main, 0.15),
                        color: theme.palette.success.main,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 1.5,
                        mt: 0.3,
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Typography variant="body2" color="text.primary" sx={{ mb: 1, lineHeight: 1.6 }}>
                      {highlight}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
          
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <LightbulbIcon sx={{ mr: 1.5, color: theme.palette.warning.main }} />
            Recommended Focus
          </Typography>
          
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 3, 
              bgcolor: alpha(theme.palette.warning.main, 0.05),
              borderColor: alpha(theme.palette.warning.main, 0.2),
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '30%',
                height: '100%',
                background: `linear-gradient(to left, ${alpha(theme.palette.warning.light, 0.05)}, transparent)`,
                pointerEvents: 'none'
              }
            }}
          >
            <Typography variant="body2" sx={{ lineHeight: 1.7 }}>{insights.weeklyReport.recommendedFocus}</Typography>
          </Paper>
        </Paper>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <Button 
          variant="contained" 
          startIcon={<RefreshIcon />}
          onClick={fetchInsights}
          sx={{
            px: 4,
            py: 1.2,
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'all 0.3s',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          Refresh Insights
        </Button>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ maxWidth: '600px', lineHeight: 1.5 }}>
          Bondfyr AI Insights analyzes your venue's data to provide personalized recommendations.<br />
          Updates are processed automatically every 24 hours, or refresh manually anytime.
        </Typography>
      </Box>
    </Box>
  );
};

export default AIInsights; 