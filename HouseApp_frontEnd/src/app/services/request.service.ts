import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export enum BodyTypes { JSON, FORMDATA };

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }

  requestGet<T>(url, model, keyName: string, headers = {}, callback = null, meta = { loading: "Loading", empty: "No results" }) {
    return new Observable(observer => {

      observer.next({ message: meta.loading });

      this.http.get<T>(url, { headers: new HttpHeaders(headers) })
        .subscribe(
          response => {
            if (response['status'] === 'error')
              observer.error(response['message'].toString());

            else if (response['status'] === 'warning')
              observer.next({ message: response['message'].toString() });

            else {
              let value = response[keyName];
              if (keyName in response && Object.keys(value).length > 0)
                observer.next({ value: value });
              else
                observer.next({ value: value, message: meta.empty });
            }
          }, err => observer.error(err),
          callback);

    }).pipe(catchError(this.handleError))
      .subscribe(
        data => { this.DataToModel(data, model, true) },
        error => this.ErrorToModel(error, model)
      )
  }

  requestPost<T>(url, model, body, headers, callback = null, config = { bodyType: BodyTypes.JSON, image: { name: "", file: null } }, meta = { loading: "Loading", empty: "No results" }) {
    return new Observable(observer => {

      observer.next({ message: meta.loading });

      let requestBody = body;

      if (config.bodyType === BodyTypes.FORMDATA) {
        let formData = new FormData();
        this.ObjectToFormdata(formData, body);

        if (config.image.name !== "" && config.image.file !== null)
          formData.append(config.image.name, config.image.file);

        requestBody = formData;

      }

      this.http.post<T>(url, requestBody, { headers: new HttpHeaders(headers) })
        .subscribe(
          response => this.ProcessMessageResponse(response, observer)
          , err => observer.error(err),
          callback);

    }).pipe(catchError(this.handleError))
      .subscribe(
        data => this.DataToModel(data, model),
        error => this.ErrorToModel(error, model)
      );
  }

  requestPut<T>(url, model, body, headers, callback = null, config = { bodyType: BodyTypes.JSON, image: null }, meta = { loading: "Loading", empty: "No results" }) {
    return new Observable(observer => {

      observer.next({ message: meta.loading });

      let requestBody = body;

      if (config.bodyType === BodyTypes.FORMDATA) {
        let formData = new FormData();
        this.ObjectToFormdata(formData, body);
        requestBody = formData;
      }

      this.http.put<T>(url, requestBody, { headers: new HttpHeaders(headers) })
        .subscribe(
          response => this.ProcessMessageResponse(response, observer),
          err => observer.error(err),
          callback);

    }).pipe(catchError(this.handleError))
      .subscribe(
        data => this.DataToModel(data, model),
        error => this.ErrorToModel(error, model)
      );
  }

  requestDelete<T>(url, model, body, headers, callback = null, config = { bodyType: BodyTypes.JSON, image: null }, meta = { loading: "Loading", empty: "No results" }) {
    return new Observable(observer => {

      observer.next({ message: meta.loading });

      this.http.delete<T>(url, { headers: new HttpHeaders(headers) })
        .subscribe(
          response => this.ProcessMessageResponse(response, observer),
          err => observer.error(err),
          callback);

    }).pipe(catchError(this.handleError))
      .subscribe(
        data => this.DataToModel(data, model),
        error => this.ErrorToModel(error, model)
      );
  }

  //#region Auxiliare
  private ProcessMessageResponse(response, observer) {
    if (response['status'] === 'error')
      observer.error(response['message'].toString());

    else if (response['status'] === 'warning')
      observer.next({ message: response['message'].toString() });

    else {
      //if status==="success"
      observer.next({ message: response['message'].toString() });
    }
  }

  private DataToModel(data, model, hasValue = false) {

    model.message = "";
    model.error = "";

    if (data['message'])
      model.message = data['message'];

    if (hasValue) {
      if (data['value'])
        model.value = data['value'];
    }

  }
  private ErrorToModel(error, model) {
    if ('value' in model) {
      model['value'] = null;
    }
    if ('error' in model) {
      model.message = "";
      model.error = error;
    }
    else
      model.message = error;
  }

  private handleError(error: any) {
    //daca este o eroare declansata de catre mine si nu de catre request.(Va contine mesajul)
    if ((typeof error) === "string")
      return throwError(error);

    return throwError("Something bad happened; please try again later.");
  }


  ObjectToFormdata(fd: FormData, dob: Object) {
    this.append(fd, dob);
    for (let key of Object.keys(dob)) {
      if (Array.isArray(dob[key]) && dob[key].length === 0)
        fd.append(key, '[]');
    }
  }
  append(fd: FormData, dob: Object, fob: Object = null, p: string = '') {
    let apnd = this.append;

    function isObj(dob, fob, p) {
      if (typeof dob == "object") {
        if (!!dob && dob.constructor === Array) {
          p += '[]';
          for (let i = 0; i < dob.length; i++) {
            let aux_fob = !!fob ? fob[i] : fob;
            isObj(dob[i], aux_fob, p);
          }
        } else {
          apnd(fd, dob, fob, p);
        }
      } else {
        let value = !!fob ? fob : dob;
        fd.append(p, value);
      }
    }

    for (let prop in dob) {
      let aux_p = p == '' ? prop : `${p}[${prop}]`;
      let aux_fob = !!fob ? fob[prop] : fob;
      isObj(dob[prop], aux_fob, aux_p);
    }
  }

}
