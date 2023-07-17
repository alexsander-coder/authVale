<style>
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400&display=swap');

.error-message {
  background-color: #dc3545;

  margin-top: 0;
  color: white;
  font-size: large;
  text-align: center;
  font-weight: 400;
  width: 50%;
  border-radius: 4px;
  padding: 1px;
  position: absolute;
}

.formatLabel {
  color: #1c1c1c;
  font-weight: 600;
  margin-top: -9px;
}

.formatTxtLabel {
  color: #383838;
  margin-bottom: 35%;
  text-align: center;
  font-weight: 600;
}

.formatTxtLabel1 {
  color: #383838;
  text-align: center;
  font-weight: 600;
  margin-bottom: 25%;
}

.formatInputMoney {
  color: #1c1c1c;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  margin-top: -9px;
  font-weight: 600;
  padding: 3.5%;
}

.formatInputMoney1 {
  color: #1c1c1c;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  font-weight: 600;
  padding: 2.6%;
  margin-top: -40px;
}

.ajusteAv {
  color: rgb(56, 56, 56);
  font-weight: 600;
  /* text-align: center; */
  margin-left: -13.5%;
  /* margin-top: -65%; */
}

.customize-table {
  --easy-table-body-row-font-size: 15.4px;
  --easy-table-header-font-size: 12.5px;
  --easy-table-body-row-font-color: #121212;
  --easy-table-header-font-color: #2b2b2b;
  --easy-table-row-border: 1px solid #cdcdcd;
  --easy-table-body-row-background-color: #f0f0f0;
  --easy-table-body-item-padding: 10px 15px;
}

.pointEvent {
  pointer-events: visible;
}

.pointEventNon {
  pointer-events: none;
}

.operation-wrapper .operation-icon {
  width: 20px;
  cursor: pointer;
}
</style>
<template>
  <div style="transform: scale(0.9); font-family: 'Nunito Sans', sans-serif;">
    <b-card style=" margin-top: -9%; background-color: #f7f7f7;">
      <b-tabs card align="center">
        <b-tab title="AVULSA" style="height: 1100px;">
          <b-form @submit="submitAvulso">
            <b-row align-h="center">
              <b-col cols="3" style="margin-top: 7%;">
                <b-form-group class="formatTxtLabel1" id="input-group-1" label="CPF:" label-for="input-1">
                  <b-form-input style="text-align: center;" class="formatLabel" id="input-1" v-maska
                    data-maska="['###.###.###-##']" v-model="form.cpfAvulso" type="text"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row align-h="center">
              <b-col cols="3">
                <b-form-group class="ajusteAv" id="input-group-2" label="Valor R$:" label-for="input-2">
                  <money3 class="formatInputMoney1" id="input-2" v-model="form.valorAvulso" v-bind="config" />
                </b-form-group>
              </b-col>
            </b-row>
            <div class="d-flex justify-content-center">
              <transition name="fade">
                <div v-if="errorMessage" class="error-message">
                  {{ errorMessage }}
                </div>
              </transition>
            </div>
            <b-row align-h="end">
              <b-col cols="3" style="margin-top: 10%;">
                <b-button type="submit" variant="success">Processar venda</b-button>
              </b-col>
            </b-row>
          </b-form><br><br>
          <b-card v-if="showQrCodeModal1" align="center" header="QR CODE VENDA AVULSA" header-text-variant="white"
            header-tag="header" header-bg-variant="dark"
            style="cursor: move; position: absolute; margin: -16% 0 0 30%; max-width: 33%; z-index: 1;">
            <p>CPF: {{ this.form.cpfAvulso }}<br>
              VALOR: {{ formatCurrency(this.form.valorAvulso) }}</p>

            <qrcode-vue :value="value" :size="size" level="H" />

            <div style="margin-top: 15%;">
              <b-button size="sm" style="margin-right: 10%;" @click="showQrCodeModal1 = false" variant="primary">REVISAR
              </b-button>
              <b-button size="sm" @click="showCancelAvulso()" variant="danger">CANCELAR
              </b-button>
            </div>
          </b-card>
        </b-tab>

        <b-tab title="CONTROLLER">
          <div style="margin-top: 5%;" :class="this.showQrCodeModal ? 'pointEventNon' : 'pointEvent'">
            <b-form @submit="addToCart">
              <!-- START CPF -->
              <b-row align-h="center">
                <b-col cols="3">
                  <b-form-group class="formatTxtLabel" id="input-group-3" label="CPF:" label-for="input-3">
                    <b-form-input style="text-align: center;" class="formatLabel" id="input-3" v-maska
                      data-maska="['###.###.###-##']" v-model="formC.cpfController" type="text"></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <!-- END CPF -->

              <!-- START PRODUTO -->
              <b-row align-h="center">
                <b-col cols="4">
                  <b-form-group class="formatTxtLabel" id="input-group-4" label="Produto:" label-for="input-4">
                    <b-form-select class="formatLabel" id="input-4" v-model="formC.produto"
                      :options="foods"></b-form-select>
                  </b-form-group>
                </b-col>
              </b-row>
              <!-- END PRODUTO -->

              <div style="margin-left: 20%;">
                <b-row align-v="end">
                  <!-- START QUANTIDADE -->
                  <b-col>
                    <b-form-group style="color: #383838; font-weight: 600;" id="input-group-5" label="Quantidade:"
                      label-for="input-5">
                      <b-form-input type="number" class="formatLabel" id="input-5"
                        v-model="formC.quantidade"></b-form-input>
                    </b-form-group>
                  </b-col>
                  <!-- END QUANTIDADE -->
                  <b-col>
                    <b-form-group style="color: #383838; font-weight: 600;" id="input-group-6" label="Valor Produto R$:"
                      label-for="input-6">
                      <money3 class="formatInputMoney" id="input-6" v-model="formC.valorController" v-bind="config" />
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-button type="submit" variant="primary">Adicionar</b-button>
                  </b-col>
                </b-row>
              </div>
            </b-form><br><br><br>
            <b-row align-h="center">
              <b-col style="color: #1c1c1c; font-weight: 600;" cols="4">Valor Total: {{
                this.formatCurrency(totalValorController) }}
              </b-col>
              <b-col cols="3"></b-col>
            </b-row>
            <br><br>
            <div class="d-flex justify-content-center">
              <transition name="fade">
                <div v-if="errorMessage" class="error-message">
                  {{ errorMessage }}
                </div>
              </transition>
            </div>
            <br><br><br>
            <EasyDataTable style="transform: scale(1.03);" labelRowsPerPageChange="'testando'" :rows-per-page="details"
              v-model:items-selected="itemsSelected" :headers="headers" border-cell theme-color="#1d90ff"
              :empty-message="eoem" table-class-name="customize-table" :items="formattedItems">
              <template #item-operation="item">
                <div class="operation-wrapper">
                  <img src="../img/download.png" class="operation-icon" @click="deleteItem(item)" />
                </div>
              </template>
            </EasyDataTable>
            <br><br>
            <b-row align-h="end">
              <b-col cols="4">
                <b-button type="submit" @click="controllerSaleProcess" variant="success">
                  Processar venda</b-button>
              </b-col>
            </b-row>
          </div><br><br><br>

          <b-card v-if="showQrCodeModal" align="center" header="QR CODE VENDA CONTROLLER" header-text-variant="white"
            header-tag="header" header-bg-variant="dark"
            style=" position: absolute; margin: -75% 0 0 30%; max-width: 33%; z-index: 1;">
            <qrcode-vue foreground="##0d6efd" background="#ffffff" :value="value" :size="size" level="H"
              render-as="svg" />
            <div style="margin-top: 15%;">
              <b-button size="sm" style="margin-right: 10%;" @click="showQrCodeModal = false" variant="primary">REVISAR
              </b-button>
              <b-button size="sm" @click="showQrCodeModalCancel()" variant="danger">CANCELAR
              </b-button>
            </div>
          </b-card>
          teste bloq acesso
          <a href="https://www.google.com.br">aqui</a><br><br>
          {{ itemsSelected }} <br>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
  <footer style="text-align: center;"> <small>&copy; {{ this.getNow() }} Vale Shop, Inc. All rights reserved.</small>
  </footer>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import { Header } from "vue3-easy-data-table";
import { Money3Component } from "v-money3";
import { vMaska } from "maska"
import QrcodeVue from "qrcode.vue";

export default defineComponent({
  directives: {
    maska: vMaska,
  },
  components: {
    money3: Money3Component,
    QrcodeVue,
  },


  data() {
    const headers: Header[] = [
      { text: "CPF", value: "cpfController", width: 160 },
      { text: "PRODUTO", value: "produto", width: 220 },
      { text: "QUANTIDADE", value: "quantidade", width: 100 },
      { text: "VALOR PRODUTO R$", value: "valorController", width: 160 },
      { text: "Operação", value: "operation" },
    ];

    const items: Array<{
      id: number,
      cpfController: number,
      selectProduto: string,
      quantityController: number,
      valorController: any
    }> = [];

    const itemsSelected: Array<{
      id: number,
      cpfController: number,
      selectProduto: string,
      quantityController: number,
      valorController: any
    }> = [];

    return {
      details: 10,
      eoem: 'Nenhum dado a ser exibido',
      value: 'ID da transação',
      size: 100,
      errorMessage: null,
      showQrCodeModal1: false,
      showQrCodeModal: false,

      form: {
        cpfAvulso: '',
        valorAvulso: ''
      },

      formC: {
        cpfController: '',
        produto: null,
        quantidade: '',
        valorController: ''
      },

      foods: [{ text: 'Select One Product', value: null }, 'Combustivel', 'Extintor', 'Pneu', 'Calibragem'],
      show: true,
      headers,
      items,
      itemsSelected
    }
  },


  computed: {
    config() {
      return {
        decimal: ",",
        thousands: ".",
        prefix: "R$ ",
        suffix: "",
        precision: 2,
        masked: false,
      };
    },

    formattedItems() {

      return this.items.map((item: any) => ({
        ...item,
        valorController: item.valorController
      }));
    },

    totalValorController(): number {
      const total = this.itemsSelected.reduce((acc: any, item: any) => {
        const valorNumerico = parseFloat(item.valorController.replace(/[^\d.,-]/g, '').replace(',', '.'));
        return acc + (valorNumerico * item.quantidade);
      }, 0);

      const totalFormated = parseFloat(total.toFixed(2));

      return totalFormated;
    }

  },

  methods: {
    enviarDados() {
      const url = 'http://localhost:3009/received';
      const dados = this.itemsSelected;
      console.log(dados, 'como vem o dados')
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
      })
        .then(response => response.json())
        .then(data => {
          console.log(data, 'fih do cabrunco o que vem aqui')
        })
        .catch(error => {
          console.log(error);
        });
    },


    showCancelAvulso() {
      this.form.cpfAvulso = ''
      this.form.valorAvulso = ''
      this.showQrCodeModal1 = false
    },

    showQrCodeModalCancel() {
      this.items = this.items.filter((itens: any) => { itens });
      this.itemsSelected = []
      this.showQrCodeModal = false
    },

    getNow() {
      const today = new Date().getFullYear();
      return today;
    },

    deleteItem(val: any) {
      this.items = this.items.filter((item: any) => item.id !== val.id);
      this.itemsSelected = this.itemsSelected.filter((obj: any) => obj.id !== val.id);
    },

    submitAvulso() {
      if (this.form.valorAvulso === "0.00" || this.form.cpfAvulso === '') {
        return this.validFormAvulso()
      }
      this.saleAvulsa = this.form
      this.showQrCodeModal1 = true

    },

    addToCart(event: any) {
      event.preventDefault()

      if (this.formC.valorController === "0.00") {
        return this.validValue()
      }

      const valorString = +this.formC.valorController;

      if (!this.validaForm(this.formC)) {
        return;
      }

      if (this.items.length === 0) {
        this.items.push({
          id: this.items.length + 1,
          cpfController: this.formC.cpfController,
          produto: this.formC.produto,
          quantidade: this.formC.quantidade,
          valorController: this.formatCurrency(valorString),
        });

        this.formC.produto = null,
          this.formC.quantidade = '',
          this.formC.valorController = ''

      } else {
        const primeiroCPF = this.items[0].cpfController;
        if (primeiroCPF === this.formC.cpfController) {
          this.items.push({
            id: this.items.length + 1,
            cpfController: this.formC.cpfController,
            produto: this.formC.produto,
            quantidade: this.formC.quantidade,
            valorController: this.formatCurrency(valorString)
          });

          this.formC.produto = null;
          this.formC.quantidade = '';
          this.formC.valorController = '';

        } else if (this.validaCpf(this.formC)) {
          return;
        }
      }
    },


    controllerSaleProcess(event: any) {
      event.preventDefault()

      if (this.validaProcessarVenda()) {
        this.enviarDados()
        console.log(this.totalValorController)
        console.log('Valor final:', this.totalValorController)
        this.showQrCodeModal = true

        setTimeout(() => {
          console.log("lista limpada após 1 second");
          // this.items = []
          // this.itemsSelected = []
        }, 1000);
      }

    },

    formatCurrency(input: any) {
      var value = parseFloat(input);
      return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },

    showErrorMessage(message: string, timeout = 6000) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = null;
      }, timeout)
    },

    validValue() {
      this.showErrorMessage('Todos os campos precisam ser preenchidos.')
    },

    validFormAvulso() {
      this.showErrorMessage('Todos os campos precisam ser preenchidos.')
    },

    validaForm(formulario: any) {
      for (let campo in formulario) {
        if (!formulario[campo]) {
          this.showErrorMessage(`Todos os campos precisam ser preenchidos.`);
          return false;
        }
      }
      return true;
    },

    validaCpf(formulario: any) {
      if (formulario.cpfController != this.itemsSelected.cpfController) {
        this.showErrorMessage('Somente um CPF/CNPJ por venda.');
        return false;
      }
      return true;
    },

    validaProcessarVenda() {
      if (this.itemsSelected.length === 0) {
        this.showErrorMessage('Selecione ao menos um item para prosseguir com a venda.');
        return false;
      }
      return true;
    }
  }
})
</script>
