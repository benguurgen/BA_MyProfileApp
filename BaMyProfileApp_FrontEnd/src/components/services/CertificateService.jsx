import React from 'react'
import { Api } from '../api/Api';

const controller = "Certificate/";

export const CertificateService = {
  
    async create(data){
        return Api.handleRequestPostAsync(controller+"Create",data,true);
    },
    async update(data){
        return Api.handleRequestPutAsync(controller+"Update",data);
    },
    async delete(id){
        return Api.handleRequestDeleteAsync(controller+"Delete",id);
    },
    async getById(id){
        return Api.handleRequestGetAsync(controller+"GetById",id);
    },
    async getAll(){
        return Api.handleRequestGetAsync(controller+"GetAll");
    }
}
