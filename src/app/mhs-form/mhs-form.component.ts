import { Component, OnInit } from '@angular/core';
import { Mhs } from '../mhs';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { FormBuilder, Validators } from 'angular/forms';

/*
interface JurusanNode {
  name: string;
  children?: JurusanNode[];
}

const TREE_DATA: JurusanNode[] = [
  {
    name: 'Program Studi',
    children: [
      {name: 'Akuntansi'},
      {name: 'Ilmu Administrasi Bisnis'},
      {name: 'Ilmu Komunikasi'},
      {name: 'Manajemen'},
      {name: 'Sistem Informasi'},
      {name: 'Teknik Informatika'}
    ]
  }
]
*/

@Component({
  selector: 'app-mhs-form',
  templateUrl: './mhs-form.component.html',
  styleUrls: ['./mhs-form.component.scss']
})
export class MhsFormComponent implements OnInit {
  id: string;
  update: boolean = false;
  mhs: Mhs;
  mhsForm = this.fb.group({
    nama: ["", [Validators.required, Validators.minLength(5)]],
    sma: ["", [Validators.required, Validators.minLength(3)]],
    domisili: ["", [Validators.required, Validators.minLength(5)]],
    tanggal: ["", [Validators.required, Validators.minLength(5)]],
    jurusan:  ["", [Validators.required]],
  })

  constructor(
    private snackBar : MatSnackBar,
    private ds: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  openSnackBar(message: string, action: string)
  {
    this.snackBar.open(message, action, {duration: 1000});
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      // jika ada parameter id di URL
      if (params.get('id')) {
        this.id = params.get('id');

        this.ds.getMhsId(this.id).subscribe(
          response => {
            this.mhs = response as Mhs;
            this.update = true;

            this.mhsForm.get("nama").setValue(this.mhs.mhsName);
            this.mhsForm.get("sma").setValue(this.mhs.smaName);
            this.mhsForm.get("domisili").setValue(this.mhs.domisili);
            this.mhsForm.get("tanggal").setValue(this.mhs.tanggal);
            this.mhsForm.get("jurusan").setValue(this.mhs.jurusan);
          },
          err => {
            console.log(err);
            this.error = true;
          }
        );
      } else {
        this.update = false;
      }
    });
  }

  postMhs() {
    this.ds.postMhs(this.mhs).subscribe(response => {
      this.openSnackBar("Berhasil Ditambahkan", null)
      this.router.navigate(['/main']);
    });
  }

  deleteMhs() {
    this.ds.deleteMhs(this.mhs).subscribe(
      response => {
        this.openSnackBar("Berhasil Dihapus", null)
        this.router.navigate(['/main']);
      },
      err => {
        console.log(err);
      }
    );
  }

  updateMhs() {
    this.ds.updateMhs(this.mhs).subscribe(
      response => {
        this.openSnackBar("Berhasil Diupdate", null)
        this.router.navigate(['/main']);
      },
      err => {
        console.log(err);
      }
    );
  }
}
