import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { Textarea } from 'primeng/textarea';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { MemberService } from '~services/member.service';
import {
  CommonModule

} from '@angular/common';
@Component({
  selector: 'app-upsert-member',
  standalone: true,
  imports: [ReactiveFormsModule, FloatLabel, InputText, FormsModule, DropdownModule, Textarea, DatePicker, Select, Button, CommonModule],
  templateUrl: './upsert-member.component.html',
  styleUrl: './upsert-member.component.scss',
  host: {
    class: 'page gap-4'
  }
})
export class UpsertMemberComponent {
  private memberService = inject(MemberService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private nnfb = this.fb.nonNullable;
  form = this.fb.group({
    memberId: this.nnfb.control<number>(null!),
    firstName: this.nnfb.control<string>('', [Validators.required, Validators.minLength(2)]),
    lastName: this.nnfb.control<string>('', [Validators.required, Validators.minLength(2)]),
    birthDate: this.nnfb.control<Date>(null!, Validators.required),
    joinedDate: this.nnfb.control<Date>(new Date(), Validators.required),
    gender: this.fb.nonNullable.control<'male' | 'female'>('male', Validators.required),
    nationality: this.nnfb.control<string>('', [Validators.required, Validators.minLength(2)]),
    notes: this.nnfb.control<string>(''),
    emails: this.fb.array<FormGroup<{
      email: FormControl<string>,
      description: FormControl<string>
    }>>([]),
    addresses: this.fb.array<FormGroup<{
      street: FormControl<string>,
      city: FormControl<string>
      zip: FormControl<string>
    }>>([]),
    phoneNumbers: this.fb.array<FormGroup<{
      phoneNumber: FormControl<string>,
      description: FormControl<string>
    }>>([])
  });

  get emails() {
    return this.form.controls.emails;
  }


  get addresses() {
    return this.form.controls.addresses;
  }

  get phoneNumbers() {
    return this.form.controls.phoneNumbers;
  }

  addEmail() {
    this.emails.push(this.fb.group({
      email: this.nnfb.control<string>('', [Validators.required, Validators.email]),
      description: this.nnfb.control<string>('', Validators.required)
    }));
  }

  addAddress() {
    this.addresses.push(this.fb.group({
      street: this.nnfb.control<string>('', Validators.required),
      city: this.nnfb.control<string>('', Validators.required),
      zip: this.nnfb.control<string>('', [Validators.required, Validators.pattern('^[0-9]{5}$')])
    }));
  }

  addPhoneNumber() {
    this.phoneNumbers.push(this.fb.group({
      phoneNumber: this.nnfb.control<string>('', [Validators.required, Validators.pattern('^[0-9]{6,}$')]),
      description: this.nnfb.control<string>('', Validators.required)
    }));
  }

  submit(): void {
    console.log(this.form);
    if (!this.form.valid) {
      this.checkIfFormIsValid();
    }
    const {
      memberId,
      firstName,
      lastName,
      birthDate,
      joinedDate,
      gender,
      nationality,
      notes,
      emails,
      addresses,
      phoneNumbers
    } = this.form.getRawValue();
    const birthDateInSeconds = Math.round(birthDate!.getTime() / 1000);
    const joinedDateInSeconds = Math.round(joinedDate!.getTime() / 1000);
    const stringifiedEmails = JSON.stringify(emails?.length ? emails : []);
    const stringifiedAddresses = JSON.stringify(addresses?.length ? addresses : []);
    const stringifiedPhoneNumbers = JSON.stringify(phoneNumbers?.length ? phoneNumbers : []);

    this.memberService.createMember({
      memberId: memberId || -1,
      firstName: firstName,
      lastName: lastName,
      birthDate: birthDateInSeconds,
      joinedDate: joinedDateInSeconds,
      gender: gender,
      nationality: nationality,
      notes: notes,
      emails: stringifiedEmails,
      addresses: stringifiedAddresses,
      phoneNumbers: stringifiedPhoneNumbers
    }).then(r => this.router.navigate(['members']));
  }

  removeEmail(index: number): void {
    this.emails.removeAt(index);
  }

  removeAdress(index: number): void {
    this.addresses.removeAt(index);
  }

  removePhoneNumber(index: number): void {
    this.phoneNumbers.removeAt(index);
  }

  checkIfFormIsValid() {
    // Markiere alle Felder als berührt, um Fehler anzuzeigen
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control) {
        control.markAsTouched();
      }
    });

    // Markiere auch nested form controls als berührt
    this.emails.controls.forEach(group => {
      Object.keys(group.controls).forEach(key => {
        const control = group.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    });

    this.addresses.controls.forEach(group => {
      Object.keys(group.controls).forEach(key => {
        const control = group.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    });

    this.phoneNumbers.controls.forEach(group => {
      Object.keys(group.controls).forEach(key => {
        const control = group.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    });

    return; // Stoppe die Ausführung wenn das Formular ungültig ist
  }
}
