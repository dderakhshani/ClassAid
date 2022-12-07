import { Component } from "@angular/core";
import { UserModel } from "../models/user";

@Component({
  selector:"displayName"
})



class User extends UserModel
{
  constructor(){
    super();
  }


}
