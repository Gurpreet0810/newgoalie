import React, { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Loader from "react-js-loader";
import { addNewComplaintReason, getAllComplaintReason, setComplaintBox } from "../store/complaintSlice";
import { validate } from "../utils/validate";
import BasicTable from "../utils/table";

const Reason = [
  { id: 1, name: 'testing-reason' },
  { id: 2, name: 'maya-support-reson' },
  { id: 3, name: 'test-company-reason' },
  { id: 4, name: 'admin-company-reason' },
  { id: 4, name: 'new-reason' },
];

const listStatus = [
  { id: 1, status: 'active' },
  { id: 2, status: 'inactive' },
];

interface StateData {
  reasonType: string,
  status: string
}

const ComplaintReason = () => {
  const  {allComplaintReason}  = useSelector((state: any) => state.complaint);



  console.log('login all reson',allComplaintReason);
  
  const [formData, setFormData] = useState<StateData>({
    reasonType: '',
    status: ''
  });

  const [errors, setErrors] = useState<any>({});
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();


  useEffect(() => {
    getAllComplaintReason(dispatch)
  },[])


  const handleCompanyChange = (event: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      reasonType: event.target.value
    });
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      status: event.target.value
    });
  };




  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const isValidate = await validate(fields, formData);

      if (isValidate) {
        setLoader(true);
        
        const res = await addNewComplaintReason(formData, dispatch);
        toast.success(res?.message,{
          autoClose:1000
        });
        resetForm();
      }
    } catch (error : any) {
      console.error('Error submitting complaint:', error);
      toast.error(error?.data?.message, {
        autoClose: 1000
      });
      setErrors(error);
    } finally {
      setLoader(false);
    }
  };

  const resetForm = () => {
    setFormData({
        reasonType: '',
        status: ''
    });
    setErrors('')
  };

  const fields = [
    { field: 'reasonType', name: 'reasonType', validate: 'required' },
    { field: 'status', name: 'status', validate: 'required' },
  ];

  

  return (
    <div className="compliance_container" style={{marginTop:'10%'}}>
      <div className="inner_child">
        <form onSubmit={handleSubmit}>
        <h3 className="add_new_comp">Add New Reason</h3>
          <div className="input_container">
            <div className="form_input">
              <p className="title">Reason</p> <span>*</span>
              <FormControl fullWidth>
                <InputLabel id="company-select-label">Select</InputLabel>
                <Select
                  labelId="company-select-label"
                  id="company-select"
                  value={formData.reasonType}
                  label="Select"
                  name="reasonType"
                  onChange={handleCompanyChange}
                >
                  {Reason && Reason.map((item) => (
                    <MenuItem  key={item.id} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.reasonType && <span className='error'>{errors.reasonType}</span>}
            </div>

            <div className="form_input">
              <p className="title">Status</p> <span>*</span>
              <FormControl fullWidth>
                <InputLabel id="status-select-label">Select</InputLabel>
                <Select
                  labelId="status-select-label"
                  id="status-select"
                  value={formData.status}
                  label="Select"
                  onChange={handleStatusChange}
                >
                  {listStatus.map((item) => (
                    <MenuItem key={item.id} value={item.status}>
                      {item.status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.status && <span className='error'>{errors.status}</span>}
            </div>

          </div>

          {loader ? (
            <Loader type="box-up" bgColor={'#00003E'} color={'yello'} size={100} />
          ) : (
            <button className="add_btn" type="submit">
              Submit Reason
            </button>
          )}
        </form>
      </div>

      <div className="all_reason_container">
        <h3 className="add_new_comp">All Reasons Report</h3>
        {allComplaintReason?.length > 0 && (
    allComplaintReason.map((item : any, index : any) => (
      <BasicTable key={index} data={item} /> // Added key prop with index
    ))
  )}

      </div>
    </div>

  );
};

export default ComplaintReason;
