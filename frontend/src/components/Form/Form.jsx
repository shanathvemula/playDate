import React, { useEffect, useState } from 'react';
import FormComponent from './FormComponent';
import { ClientInfo } from '../../api/service';
// import Layout from '../../layout/Layout';

const Form = () =>{
    const [formData, setFormData] = useState(null);
    // const formData = ClientInfo()

    useEffect(() => {
      const fetchClientInfo = async () => {
        try {
          const response = await ClientInfo();
          console.log('client',response)
          setFormData(response);
        } catch (err) {
          console.log('Failed to fetch company info', err);
        }
      };
  
      fetchClientInfo();
    }, []);

    return (
      // <Layout>
        <div>
            {formData ? <FormComponent initialData={formData} /> : <FormComponent initialData={formData} />}
            {/* <FormComponent /> */}
        </div>
      // </Layout>
    )
}

export default Form;