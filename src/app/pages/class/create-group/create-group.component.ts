import { GroupModel, SubGroupModel } from './../../../models/student-group';
import { Component, Input, OnInit } from '@angular/core';
import { Lesson } from 'src/app/models/lessons';
import { StudentModel } from 'src/app/models/student';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { IFormGroup, IFormBuilder } from '@rxweb/types';
import { ClassService } from 'src/app/api/class.service';
import { GlobalService } from 'src/app/services/global.service';
import { StudentsService } from 'src/app/api/students.service';

@Component({
    selector: 'app-create-group',
    templateUrl: './create-group.component.html',
    styleUrls: ['./create-group.component.scss'],
})
export class CreateGroupComponent implements OnInit {

    @Input()
    modal: any;

    @Input()
    lesson: Lesson;

    @Input()
    book: Lesson;

    subGroups: SubGroupModel[] = [];
    selectedGroup: SubGroupModel;
    selectedStudents: StudentModel[];
    disabledStudentIds: number[] = [];
    students: StudentModel[];

    isModalOpen = false;

    mode: 'create-auto' | 'manual' | '' = '';
    groupMode: 'private' | 'public' = 'public'
    form: IFormGroup<GroupModel>;
    formBuilder: IFormBuilder;

    constructor(formBuilder: FormBuilder,
        private classService: ClassService,
        private loadingCtrl: LoadingController,
        public globalService: GlobalService,
        private studentsService: StudentsService,
        public toastController: ToastController) {
        this.formBuilder = formBuilder;
    }

    ngOnInit() {
        this.form = this.formBuilder.group<GroupModel>({
            id: [0],
            name: ["", [Validators.required]],
            classId: [0],
            lessonId: [this.book.id],
            subLessonId: [this.lesson.id],
            homeWorkId: [''],
            isPublic: [true],
            subGroups: [[]]
        });

        this.studentsService.getStudentsOfClass(this.globalService.selectedClass.id).then(data => {
            //Disconnecting student from originals
            this.students = data.map(x => Object.assign(new StudentModel(), x));
        });
    }

    modalChanged(event) {
        console.log(event)
    }

    createAutoGroup(count: number) {
        this.subGroups = [];
        let students = [...this.students];
        const numberOfGroups = Math.ceil(this.students.length / count);
        for (let i = 0; i < numberOfGroups; i++) {

            let randStudents = [];
            for (let i = 0; i < count && students.length > 0; i++) {
                const rndIndex = Math.floor(Math.random() * students.length);
                randStudents.push(students[rndIndex]);
                students.splice(rndIndex, 1);
            }
            const group = <SubGroupModel>{
                name: "",
                students: randStudents
            }
            this.subGroups.push(group)
        }
        this.mode = '';
    }

    addGroup() {
        this.filldisabledStudentIds();
        this.selectedGroup = undefined;
        this.selectedStudents = [];
        this.isModalOpen = true;
    }

    removeGroup(index: number) {
        this.subGroups.splice(index, 1);
    }


    editGroup(group: SubGroupModel) {
        this.filldisabledStudentIds(group);
        this.selectedGroup = group;
        this.selectedStudents = group.students;
        this.isModalOpen = true;
    }

    filldisabledStudentIds(group?: SubGroupModel) {
        this.disabledStudentIds = [];
        this.subGroups.forEach(sg => {
            if (group != sg)
                sg.students.forEach(s => {
                    this.disabledStudentIds.push(s.id);
                })
        })
    }

    onSelectStudents(selectedStudents: StudentModel[]) {
        this.isModalOpen = false;
        setTimeout(() => {
            if (this.selectedGroup)
                this.selectedGroup.students = selectedStudents;
            else {
                const group = <SubGroupModel>{
                    name: "",
                    students: selectedStudents
                }
                this.subGroups.push(group)
            }
        }, 400);
    }


    async save() {
        if (!this.form.valid) {
            const toast = await this.toastController.create({
                message: 'لطفا عنوان گروه را پر نمایید',
                duration: 3000,
            });
            toast.present();
            return;
        }
        else if (this.subGroups.length < 2) {
            const toast = await this.toastController.create({
                message: 'حداقل دو گروه دانش آموزی ایجاد شود',
                duration: 5000,
            });
            toast.present();
            return;
        }
        const group = this.form.getRawValue() as GroupModel;
        group.classId = this.globalService.selectedClass.id;
        group.isPublic = this.groupMode == 'public';
        group.subGroups = this.subGroups;

        const loading = await this.loadingCtrl.create();
        loading.present();

        this.classService.addGroup(group).then(x => {
            loading.dismiss();
            this.classService.classGroups = [...this.classService.classGroups, group];
            this.modal.dismiss();
        }, err => {
            loading.dismiss();
        });
    }
}
