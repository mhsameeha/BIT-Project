'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import { Course } from '@/types/course';
import { Category } from '@/types/category';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import { Upload as CloudUploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import styled from '@mui/system/styled';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';

import { z as zod } from 'zod';

import { useUser } from '@/hooks/use-user';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Input from '@mui/material/Input';
import axios from 'axios';


  const schema = zod.object({
  courseName: zod.string().min(1, { message: 'Course Name is Required' }),
  briefIntro: zod.string().min(50, { message: 'Brief introfuction is required' }),
  courseDescription: zod.string().min(200, { message: 'Course Description is required' }),
  courseCategory: zod.string().min(6, { message: 'Select a Category' }),
  price: zod.number().min(10, { message: 'Course Description is required' }),
  course: zod.string().min(6, { message: 'Select a Category' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { courseName: '', briefIntro:'', courseDescription: '', courseCategory: '', course:'', price:0 } satisfies Values;

class CourseForm {
  async addCourse(params:Values) {
    

  try {
      const response = await axios.post('https://localhost:7028/api/User/signup', {
        courseName: params.courseName,
        briefIntro: params.briefIntro,
        courseDescription: params.courseDescription,
        courseCategory: params.courseCategory,
        price:params.price,
        course: params.course
      });

        return {};
  } catch (error: any) {
    console.error('Submit Error:', error);
    return { error: error?.response?.data || 'Submit failed' };
  }
}


}
export const courseFrom = new CourseForm();



export function AddCourseForm(): React.JSX.Element {

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [category, setCategory] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };

    const [categoryList, setCategoryList] =  React.useState<Category[]>([]);
    const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
  color:'secondary'
});



  
  const getCategories = async ()  => {
          try {
  
              // set this up after developing the API
              const response = await fetch('https://localhost:7028/api/category', {
              method: 'GET',
              });
          
              if (!response.ok) {
              const errorMessage = await response.text();
              return { error: errorMessage || 'Invalid Request' };
              }
              return response.json();
          }
          catch (error) {
              console.error('Request Error:', error);
              // return { error: 'Something went wrong while signing in' };
          }
         
  
          return [];
      }
  
    React.useEffect(()   =>   {
      const fetchData = async () => {
          const returnValue = await getCategories();
          console.log('returnValue', returnValue);
          
              if ('error' in returnValue) {
        console.error(returnValue.error);
              const errorMessage = returnValue;
  
        // Optionally, handle error UI here
        return { error: errorMessage || 'Invalid Request' };
      } 
      setCategoryList(returnValue);
    console.log(returnValue);
    
        };
  
        fetchData();
     
      //initial load 
    }, [])
  


  const router = useRouter();

  const { checkSession } = useUser();

  const [isPending, setIsPending] = React.useState<boolean>(false);

  const [ role,setRole] = React.useState ('');
  // const [clicked, setClicked] = useState(false);

  
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });



  const onSubmit = React.useCallback(
    async (values: Values) => {
      setIsPending(true);

      // const { error } = await CourseForm.addCourse(values);

      // if (error) {
      //   setError('root', { type: 'server', message: error });
      //   setIsPending(false);
      //   return;
      // }

      // Refresh the auth state
      // await checkSession?.();

      // UserProvider, for this case, will not refresh the router
      // After refresh, GuestGuard will handle the redirect
      router.refresh();
    },
    [checkSession, router, setError]
  );



  return (
       <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add Course
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
        BackdropProps={{
          sx: {
            backdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(0,0,0,0.3)'
          }
        }}
      >
        <DialogTitle>Add New Course</DialogTitle>

        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card elevation={0}>
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Course Name</InputLabel>
                      <OutlinedInput label="Course Name" name="courseName" />
                    </FormControl>
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Course Description In Brief</InputLabel>
                      <OutlinedInput label="Course Description" name="briefIntro" />
                    </FormControl>
                  </Grid>

                  <Grid item md={12} xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Course Description</InputLabel>
                      <OutlinedInput label="Course Description" name="courseDescription" />
                    </FormControl>
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Course Category</InputLabel>
                      <Select label="Course Category" onChange={handleChange}>
                        {categoryList.map((list:Category) => (
                          <MenuItem key={list.categoryid}>
                            {list.categoryName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Course Price</InputLabel>
                      <OutlinedInput label="Course Price" name="price" />
                    </FormControl>
                  </Grid>
                  

                  <Grid item md={3} xs={6}>
                    <FormControl fullWidth>
                          {/* <Button
                component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    > */}
      <OutlinedInput color='secondary'
      type = "file"
      name='course'
      
      />
      {/* <VisuallyHiddenInput
        type="file"
        onChange={(event: { target: { files: any; }; }) => console.log(event.target.files)}
        multiple
      /> */}
    {/* </Button> */}
                      
                    </FormControl>
                  </Grid>

                  {/* <Grid item md={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>State</InputLabel>
                      <Select defaultValue="New York" label="State" name="state">
                     
                      </Select>
                    </FormControl>
                  </Grid> */}

                  {/* <Grid item md={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>City</InputLabel>
                      <OutlinedInput label="City" name="city" />
                    </FormControl>
                  </Grid> */}
                </Grid>
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button variant="contained" type="submit">
                  Save details
                </Button>
              </CardActions>
            </Card>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
