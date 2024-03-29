import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContactsService } from 'src/app/services/contacts.service';
import { RegistriesService } from 'src/app/services/registries.service';
import * as FileSaver from 'file-saver';
import * as JSPdf from 'jspdf';
import autoTable from 'jspdf-autotable'
import { FileService } from 'src/app/services/files.service';
import { CarrinhoService } from 'src/app/services/carrinho.service';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.scss']
})
export class CarrinhoComponent implements OnInit {
  @ViewChild('addMember', { static: true }) addMember!: TemplateRef<any>;
  @ViewChild('modalDelete', { static: true }) modalDelete!: TemplateRef<any>;

  members: any[] = [];
  member: any = {
    name: '',
    phone: '',
    imagem: '',
    congregationId: ''
  };
  exportColumns!: any[];
  spinner: boolean = false;
  spinnerEdit: boolean = false;
  constructor(private modal: NgbModal, private kartService: CarrinhoService, private fileService: FileService) { }

  ngOnInit(): void {
    this.getMembers();
    let congregation = localStorage.getItem('congregation')
    let id  = congregation ? JSON.parse(congregation) : []
    this.member.congregationId = id ? id[0].id : []
  }
  getMembers() {
    this.kartService.getKartMembers(this.member.congregationId).then((res: any) => {
      this.members = res;
    })
  }

  openSave() {
    this.member = {
      id: '',
      name: '',
      phone: '',
      imagem: ''
    }
    let congregation = localStorage.getItem('congregation')
    let id  = congregation ? JSON.parse(congregation) : []
    this.member.congregationId = id ? id[0].id : []
    this.modal.open(this.addMember, { size: 'lg' });
  }
  saveMember() {
    if (this.member.id == null || this.member.id == '') {
      delete (this.member.id)
      this.kartService.addMember(this.member)
    } else {
      this.kartService.editMember(this.member)
    }
    this.getMembers();
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
    this.kartService.deleteMember(this.member);
    this.getMembers();
  }

  uploadFile(event: any) {
    this.spinner = true;
    const file = event.target.files[0];
    let reader = new FileReader()
    let nome = this.member.name
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      this.fileService.uploadFile("Carrinho", nome + Date.now(), reader.result).then(
        (urlImagem: any) => {
          this.member.imagem = urlImagem
          this.spinner = false;
        }
      )
    }
  }
}
