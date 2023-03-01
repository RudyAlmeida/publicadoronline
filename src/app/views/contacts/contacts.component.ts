import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContactsService } from 'src/app/services/contacts.service';
import { RegistriesService } from 'src/app/services/registries.service';
import * as FileSaver from 'file-saver';
import * as JSPdf from 'jspdf';
import autoTable from 'jspdf-autotable'

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  @ViewChild('addMember', { static: true }) addMember!: TemplateRef<any>;
  @ViewChild('modalDelete', { static: true }) modalDelete!: TemplateRef<any>;

  members: any[] = [];
  member: any = {
    name: '',
    phone: '',
    email: '',
    idRegistry: ''
  };
  exportColumns!: any[];
  constructor(private modal: NgbModal, private contactService: ContactsService, private registryService: RegistriesService) { }

  ngOnInit(): void {
    this.getMembers();
  }
  getMembers() {
    this.contactService.getMembers().then((res: any) => {
      this.members = res;
    })
  }

  openSave() {
    this.member = {
      id: '',
      name: '',
      phone: '',
      email: '',
      idRegistry: ''
    }
    this.modal.open(this.addMember, { size: 'lg' });
  }
  saveMember() {
    if (this.member.id == null || this.member.id == '') {
      delete (this.member.id)
      this.contactService.addMember(this.member)
    } else {
      this.contactService.editMember(this.member)
    }
    this.getMembers();
  }
  getHours(email: string, index: number) {
    let date: Date = new Date()
    let totalCollectionName: string = `totals-${(date.getMonth() - 1).toString()}-${date.getFullYear().toString()}`
    this.registryService.getTotals(totalCollectionName, email).then((res: any) => {
      let currentIndex = this.members.findIndex(member => member.idRegistry == email)
      this.members[currentIndex].totals = res
    })
  }


  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        function createHeaders(keys: any) {
          var result = [];
          for (var i = 0; i < keys.length; i += 1) {
            console.log(keys[i])
            if (keys[i] == "name") {
              console.log(typeof (keys[i]))

            }
            result.push({
              id: keys[i],
              name: keys[i],
              prompt: keys[i],
              width: 65,
              align: "center",
              padding: 0
            });
          }
          return result;
        }
        var headers: any[] = createHeaders(['id', 'name', 'phone', 'idRegistry', 'email']);
        //const doc = new jsPDF.default('p', 'pt');
        const head = [['id', 'name', 'phone', 'idRegistry', 'email']]
        const data = [...this.members]
        var doc = new jsPDF.default({ putOnlyUsedFonts: true, orientation: "landscape" });
        doc.setFontSize(5);
        doc.table(1, 1, this.members, headers, { autoSize: true, fontSize: 9 });
        /* autoTable(doc, {
          head: head,
          body: [...this.members],
          didDrawCell: (data) => { data },
        }); */
        doc.save('members.pdf');
      })
    })
  }
  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.members);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "products");
    });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
  openEdit(member: any) {
    this.member = member
    this.modal.open(this.addMember, { size: 'lg' });
  }
  openDeleteModal(member: any) {
    this.member = member
    this.modal.open(this.modalDelete, { size: 'lg' });
  }
  deleteFromDb() {
    this.contactService.deleteMember(this.member);
    this.getMembers();
  }
}
