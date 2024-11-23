import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { Textarea } from 'primeng/textarea';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { MemberService } from '~services/member.service';

@Component({
  selector: 'app-upsert-member',
  standalone: true,
  imports: [ReactiveFormsModule, FloatLabel, InputText, FormsModule, DropdownModule, Textarea, DatePicker, Select, Button],
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
    firstName: this.nnfb.control<string>('', Validators.required),
    lastName: this.nnfb.control<string>('', Validators.required),
    birthDate: this.nnfb.control<Date>(null!, Validators.required),
    joinedDate: this.nnfb.control<Date>(new Date(), Validators.required),
    gender: this.fb.nonNullable.control<'male' | 'female'>('male', Validators.required),
    nationality: this.nnfb.control<string>('', Validators.required),
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
      email: this.nnfb.control<string>('', Validators.required),
      description: this.nnfb.control<string>('')
    }));
  }

  addAddress() {
    this.addresses.push(this.fb.group({
      street: this.nnfb.control<string>('', Validators.required),
      city: this.nnfb.control<string>('', Validators.required),
      zip: this.nnfb.control<string>('', Validators.required)
    }));
  }

  addPhoneNumber() {
    this.phoneNumbers.push(this.fb.group({
      phoneNumber: this.nnfb.control<string>('', Validators.required),
      description: this.nnfb.control<string>('')
    }));
  }

  submit(): void {
    console.log(this.form);
    if (!this.form.valid) {
      return;
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
}
