import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  IconButton,
  Snackbar,
  Alert,
  AlertTitle
} from '@mui/material';
import { FaUpload, FaFileAlt, FaImages, FaTrashAlt } from 'react-icons/fa';
import { styled } from '@mui/material/styles';
import Resizer from 'react-image-file-resizer';
import { ClientInfo, ClientInfoPost } from '../../../api/service';
import Navbar from '../Navbar';
import Footer from '../../footer';
import Sidebar from '../Sidebar';
import './FormComponent.css'; // Optional for your custom styles

const Input = styled('input')({
  display: 'none',
});

const FormComponent = () => {
  const { control, handleSubmit, setValue, reset, watch } = useForm();
  const [logoPreview, setLogoPreview] = useState(null);
  const [slideshow, setSlideshow] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentURL, setCurrentURL] = useState("");
  const [notification, setNotification] = useState({ open: false, message: '', severity: '' });
  const [errors, setErrors] = useState({ name: false, copyright: false, logo: false });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ClientInfo();
        if (data) {
          setValue('name', data.name || '');
          setValue('copyright', data.copyright || '');

          if (data.logo) {
            setLogoPreview(data.logo);
          }

          if (data.slideshow) {
            const slideshowData = Array.isArray(data.slideshow) ? data.slideshow : JSON.parse(data.slideshow);
            setSlideshow(slideshowData);
          }
        }
      } catch (error) {
        console.log("Error fetching data:", error);
        setNotification({ open: true, message: 'Failed to load data.', severity: 'error' });
      }
    };

    fetchData();
  }, [setValue]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const onSubmit = async (data) => {
    setNotification({ open: false, message: '', severity: '' });

    let newErrors = { name: false, copyright: false, logo: false };
    let hasError = false;

    if (!data.name) {
      newErrors.name = true;
      hasError = true;
    }
    if (!data.copyright) {
      newErrors.copyright = true;
      hasError = true;
    }
    if (!data.logo && !logoPreview) {
      newErrors.logo = true;
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      setNotification({ open: true, message: 'Please fill out all required fields.', severity: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('copyright', data.copyright);

    if (data.logo) {
      const logoBase64 = await toBase64(data.logo[0]);
      formData.append('logo', logoBase64);
    }

    const slideshowBase64 = await Promise.all(
      slideshow.map(async (item) => {
        if (item.file) {
          const base64Image = await toBase64(item.file);
          return {
            url: item.url,
            image: base64Image
          };
        }
        return item;
      })
    );

    formData.append('slideshow', JSON.stringify(slideshowBase64));

    try {
      const notify = await ClientInfoPost(formData);
      setNotification({ open: true, message: notify.message, severity: notify.severity });
    } catch (error) {
      console.log("error", error);
      setNotification({ open: true, message: 'Failed to submit the form.', severity: 'error' });
    }
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('logo', [file]);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      resizeImage(file, (resizedFile) => {
        setCurrentImage(resizedFile);
      });
    }
  };

  const resizeImage = (file, callback) => {
    Resizer.imageFileResizer(
      file,
      600,
      400,
      'JPEG',
      100,
      0,
      (uri) => {
        const resizedFile = dataURItoFile(uri, file.name);
        callback(resizedFile);
      },
      'base64'
    );
  };

  const dataURItoFile = (dataURI, filename) => {
    const arr = dataURI.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleAddSlideshowImage = () => {
    if (currentImage && currentURL) {
      setSlideshow([...slideshow, { url: currentURL, file: currentImage }]);
      setCurrentImage(null);
      setCurrentURL("");
      setValue('slideshow', [...(watch('slideshow') || []), currentImage]);
    }
  };

  const handleRemoveSlideshowImage = (index) => {
    setSlideshow(slideshow.filter((_, i) => i !== index));
  };

  const handleURLChange = (index, newURL) => {
    const updatedSlideshow = slideshow.map((item, i) =>
      i === index ? { ...item, url: newURL } : item
    );
    setSlideshow(updatedSlideshow);
  };

  const handleReset = () => {
    reset();
    setLogoPreview(null);
    setSlideshow([]);
    setCurrentImage(null);
    setCurrentURL("");
    setNotification({ open: false, message: '', severity: '' });
    setErrors({ name: false, copyright: false, logo: false });
  };

  const handleCloseNotification = () => {
    setNotification({ open: false, message: '', severity: '' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-100 dark:bg-gray-900">
      <div className="flex flex-grow">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-grow transition-all duration-300">
          <Navbar className="sticky-navbar" />
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>Upload Form</Typography>

            <Snackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={notification.open}
              autoHideDuration={6000}
              onClose={handleCloseNotification}
            >
              <Alert onClose={handleCloseNotification} severity={notification.severity}>
                <AlertTitle>{notification.severity === 'success' ? 'Success' : 'Error'}</AlertTitle>
                {notification.message}
              </Alert>
            </Snackbar>

            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={errors.name}
                  helperText={errors.name ? "Name is required" : ""}
                  InputProps={{
                    startAdornment: <FaFileAlt style={{ marginRight: 8 }} />,
                  }}
                />
              )}
            />

            <Controller
              name="copyright"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Copyright"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={errors.copyright}
                  helperText={errors.copyright ? "Copyright is required" : ""}
                  InputProps={{
                    startAdornment: <FaFileAlt style={{ marginRight: 8 }} />,
                  }}
                />
              )}
            />

            <Typography variant="h6" gutterBottom>Upload Logo</Typography>
            <Typography variant="body2" color="textSecondary">Recommended resolution: 150x150 pixels</Typography>
            <label htmlFor="logo-upload">
              <Input
                accept="image/*"
                id="logo-upload"
                type="file"
                onChange={handleLogoChange}
              />
              <Button variant="contained" component="span" startIcon={<FaUpload />}>
                Upload Logo
              </Button>
            </label>
            {errors.logo && <Typography color="error">Logo is required</Typography>}
            {logoPreview && <img src={logoPreview} alt="Logo Preview" style={{ marginTop: 10, maxHeight: 100 }} />}

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Add Slideshow Image</Typography>
            <Typography variant="body2" color="textSecondary">Recommended resolution: 600x400 pixels</Typography>
            <label htmlFor="image-upload">
              <Input
                accept="image/*"
                id="image-upload"
                type="file"
                onChange={handleImageChange}
              />
              <Button variant="contained" component="span" startIcon={<FaImages />}>
                Choose Image
              </Button>
            </label>
            {currentImage && <Typography>{currentImage.name}</Typography>}
            
            <TextField
              label="Image URL"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentURL}
              onChange={(e) => setCurrentURL(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddSlideshowImage}
              disabled={!currentImage || !currentURL}
            >
              Add to Slideshow
            </Button>

            {slideshow.length > 0 && (
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {slideshow.map((item, index) => (
                  <Grid item xs={12} md={6} key={index} position="relative">
                    <img 
                      src={item.file ? URL.createObjectURL(item.file) : item.image} 
                      alt={`Slide ${index + 1}`} 
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                    />
                    <TextField
                      label="Image URL"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={item.url}
                      onChange={(e) => handleURLChange(index, e.target.value)}
                    />
                    <IconButton
                      onClick={() => handleRemoveSlideshowImage(index)}
                      style={{ position: 'absolute', top: 0, right: 0 }}
                    >
                      <FaTrashAlt />
                    </IconButton>
                  </Grid>
                ))}
              </Grid>
            )}

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleReset}>
                Reset
              </Button>
            </Box>
          </Box>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default FormComponent;
