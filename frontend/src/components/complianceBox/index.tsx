import React, { useState } from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import Loader from "react-js-loader";
import { setComplaintBox } from "../store/complaintSlice";
import { validate } from "../utils/validate";
import { useNavigate } from "react-router";

const company = [
  { id: 1, name: 'transport-company' },
  { id: 2, name: 'maya-support' },
  { id: 3, name: 'test-company' },
  { id: 4, name: 'admin-company' },
];

const listStatus = [
  { id: 1, status: 'active' },
  { id: 2, status: 'inactive' },
];

interface StateData {
  company: string,
  status: string,
  fileName: string,
  file: string[],
}

const ComplianceBox = () => {
  const [formData, setFormData] = useState<StateData>({
    company: '',
    status: '',
    fileName: '',
    file: [],
  });

  const [errors, setErrors] = useState<any>({});
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleCompanyChange = (event: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      company: event.target.value
    });
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      status: event.target.value
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const base64Files = await Promise.all(Array.from(files).map(async (file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB", { autoClose: 1000 });
        return null;
      }

      try {
        const base64 = await readFileAsBase64(file);
        return base64;
      } catch (error) {
        console.error('Error converting file to base64:', error);
        toast.error("Failed to read file", { autoClose: 1000 });
        return null;
      }
    }));

    setFormData({
      ...formData,
      file: base64Files.filter((file) => file !== null) as string[] // Filter out null values
    });
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const isValidate = await validate(fields, formData);

      if (isValidate) {
        setLoader(true);
        const res = await setComplaintBox(formData, dispatch);
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
      company: '',
      status: '',
      fileName: '',
      file: [],
    });
    setErrors('')
  };

  const fields = [
    { field: 'company', name: 'Company', validate: 'required' },
    { field: 'status', name: 'Status', validate: 'required' },
    { field: 'fileName', name: 'File Name', validate: 'required' },
    { field: 'file', name: 'File', validate: 'required' },
  ];

  return (
    <div className="compliance_container">
       <div className="header_section">
     <h1>Compliance Box Tool Box Master</h1>
     <button className="add_btn"
     onClick={() => navigate('/add-new-reason')}
      >Add New Reason</button>
     </div>
      <div className="inner_child">
        <form onSubmit={handleSubmit}>
          <h3 className="add_new_comp">Add New Compliance</h3>
          <div className="input_container">
            <div className="form_input">
              <p className="title">Company</p> <span>*</span>
              <FormControl fullWidth>
                <InputLabel id="company-select-label">Select</InputLabel>
                <Select
                  labelId="company-select-label"
                  id="company-select"
                  value={formData.company}
                  label="Select"
                  onChange={handleCompanyChange}
                >
                  {company.map((item) => (
                    <MenuItem key={item.id} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.company && <span className='error'>{errors.company}</span>}
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

            <div className="form_input">
              <label htmlFor="file-fileName">
                File Name <span>*</span>
              </label>
              <input
                value={formData.fileName}
                name="fileName"
                id="file-fileName"
                className="file_name"
                type="text"
                onChange={handleInputChange}
              />
              {errors.fileName && <span className='error'>{errors.fileName}</span>}
            </div>

            <div className="form_input" style={{ width: '100%' }}>
              <label htmlFor="file-name">
                Upload Document <span>(Max 5MB)</span>
              </label>
              <input
                name="file"
                id="file-name"
                type="file"
                onChange={handleFileChange}
                accept=".png, .jpg, .jpeg"
              />
              {errors.file && <span className='error'>{errors.file}</span>}
            </div>
          </div>

          {loader ? (
            <Loader type="box-up" bgColor={'#00003E'} color={'yello'} size={100} />
          ) : (
            <button className="add_btn" type="submit">
              Submit Compliance
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ComplianceBox;
