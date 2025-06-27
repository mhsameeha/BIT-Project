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
import { Controller, useForm } from 'react-hook-form';
import Input from '@mui/material/Input';
import axios from 'axios';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/system/Stack';


  const schema = zod.object({
  courseName: zod.string().min(1, { message: 'Course Name is Required' }),
  briefIntro: zod.string().min(50, { message: 'Brief introfuction is required' }),
  courseDescription: zod.string().min(200, { message: 'Course Description is required' }),
  courseCategory: zod.string().min(6, { message: 'Select a Category' }),
  price: zod.number({ invalid_type_error: 'Price must be greater than 0' })
  .min(1, { message: 'Price must be a number' }),
  course: zod.string().min(6, { message: 'Add File' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { courseName: '', briefIntro:'', courseDescription: '', courseCategory: '', course:'', price:0 } satisfies Values;

class CourseForm {
  static addCourse(values: { courseName: string; briefIntro: string; courseDescription: string; courseCategory: string; price: number; course: string; }): { error: any; } | PromiseLike<{ error: any; }> {
    throw new Error('Method not implemented.');
  }
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
  console.log(response);

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

  const handleCancel = () => {
    setOpen(false);
  };
  const [category, setCategory] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
    console.log(event.target.value);
    
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
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema), mode:'onTouched' });



  const onSubmit = React.useCallback(
    async (values: Values) => {
      setIsPending(true);

      const { error } = await CourseForm.addCourse(values);

      if (error) {
        setError('root', { type: 'server', message: error });
        setIsPending(false);
        return;
      }

      // Refresh the auth state
      await checkSession?.();

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
<form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
  <Stack spacing={3}>

    {/* Course Name */}
    <Controller
      control={control}
      name="courseName"
      render={({ field }) => (
        <FormControl error={Boolean(errors.courseName)} fullWidth>
          <InputLabel>Course Name</InputLabel>
          <OutlinedInput {...field} label="Course Name" />
          {errors.courseName ? <FormHelperText>{errors.courseName.message}</FormHelperText>:null}
        </FormControl>
      )}
    />

    {/* Course Brief */}
    <Controller
      control={control}
      name="briefIntro"
      render={({ field }) => (
        <FormControl error={Boolean(errors.briefIntro)} fullWidth >
          <InputLabel>Course Brief</InputLabel>
          <OutlinedInput {...field} label="Course Brief" />
          {errors.briefIntro && <FormHelperText>{errors.briefIntro.message}</FormHelperText>}
        </FormControl>
      )}
    />

    {/* Course Description */}
    <Controller
      control={control}
      name="courseDescription"
      render={({ field }) => (
        <FormControl error={Boolean(errors.courseDescription)} fullWidth >
          <InputLabel>Course Description</InputLabel>
          <OutlinedInput
            {...field}
            label="Course Description"
            multiline
            rows={4}
          />
          {errors.courseDescription && <FormHelperText>{errors.courseDescription.message}</FormHelperText>}
        </FormControl>
      )}
    />

    {/* Course Category (Dropdown) */}
    <Controller
      control={control}
      name="courseCategory"
      render={({ field }) => (
        <FormControl error={Boolean(errors.courseCategory)} fullWidth >
          <InputLabel>Course Category</InputLabel>
          <Select {...field} label="Course Category" onChange={handleChange}>
           {categoryList.map((list:Category) => (
                          <MenuItem key={list.categoryid}>
                            {list.categoryName}
                          </MenuItem>
                        ))}
          </Select>
          {errors.courseCategory && <FormHelperText>{errors.courseCategory.message}</FormHelperText>}
        </FormControl>
      )}
    />

    {/* Course Price */}
    <Controller
      control={control}
      name="price"
      render={({ field }) => (
        <FormControl error={Boolean(errors.price)} fullWidth >
          <InputLabel>Course Price</InputLabel>
          <OutlinedInput {...field} label="Course Price" type="number" />
          {errors.price && <FormHelperText>{errors.price.message}</FormHelperText>}
        </FormControl>
      )}
    />

    {/* File Upload */}
    <Controller
      control={control}
      name="course"
      render={({ field }) => (
        <FormControl fullWidth>
          <Button variant="outlined" component="label">
            Choose File
            <input
              type="file"
              hidden
              // onChange={(e) => field.onChange(e.target.files[0])}
            />
          </Button>
          {field.value && <FormHelperText>{field.value}</FormHelperText>}
        </FormControl>
      )}
    />

    {/* Action Buttons */}
    <Stack direction="row" justifyContent="flex-end" spacing={2}>
      <Button variant="text" color="inherit" onClick={handleCancel}>
        Cancel
      </Button>
      <Button type="submit" variant="contained" color="primary">
        Save details
      </Button>
    </Stack>

  </Stack>
</form>
        </DialogContent>
      </Dialog>
    </>
  );
}
