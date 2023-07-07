<style>
@import url('https://fonts.googleapis.com/css2?family=Geologica&family=Maven+Pro:wght@600&display=swap');

.formatInput {
  padding: 4px;
}

.formatVal {
  color: rgb(255, 255, 255);
  background-color: #198754;
  border-radius: 5px;
  font-size: larger;
  padding: 0 4px 0 3px;
  margin-left: 1%;
}

.error-message {
  background-color: #dc3545;
  margin-top: 5%;
  color: white;
  font-size: large;
  text-align: center;
  font-weight: 400;
  width: 50%;
  border-radius: 4px;
  z-index: 1;
  padding: 1px;
  opacity: 1;
  position: absolute;
}

fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.formatAvulsa {
  text-align: center;
  margin: 25% 0 2px 0;
}

.formatControllerInput {
  white-space: pre;
  margin: 22% 0 0 0;
}

.formatValueTotal {
  color: black;
  margin: 10% 0 11% 27.7%;
  text-decoration: underline
}

.process {
  margin-left: -15%;
}

.pointEvent {
  pointer-events: visible;
}

.pointEventNon {
  pointer-events: none;
}

.xyx {
  color: rgb(0, 0, 0);
  background-color: rgb(0, 0, 0);

}

.zyz {
  color: red;
  background-color: rebeccapurple;
}
</style>
<template>
  <div style="font-family: Maven Pro, sans-serif; color: rgb(53, 53, 53); transform: scale(0.8);">
    <h4 style="text-align: center; margin: -60px 0 3.5% 0; ">Selecione o tipo de venda
    </h4>

    <!-- START VENDA AVULSA -->
    <b-tabs content-class="mt-3" align="center">
      <b-tab title="AVULSA" active>
        <div :class="this.showQrCodeModal1 ? 'pointEventNon' : 'pointEvent'">
          <b-form @submit="onSubmit" v-if="show">
            <b-row align-h="center">
              <b-col sm="3">
                <p class="formatAvulsa">
                  CPF:</p>
                <b-form-input required v-maska data-maska="['###.###.###-##']" id="input-1" v-model="form.cpfAvulso"
                  type="text">
                </b-form-input>
                <p class="formatAvulsa" style="margin-top: 22%;">Valor R$:</p>
                <b-form-input class="formatInput" required id="input-2" v-model="form.valorAvulso">
                </b-form-input>
              </b-col>
            </b-row>
            <div class="d-flex justify-content-center" style="margin-top: 15%;">
              <strong style="text-decoration: underline;">VALOR TOTAL R$: </strong>
              <strong class="formatVal" v-for="n in getValueAvulso" :key="n"> {{ formatCurrency(n)
              }}</strong>
            </div>
            <b-row align-h="end" style="margin-top: 5%;">
              <b-col cols="4">
                <b-button v-b-tooltip.hover title="Prosseguir com venda" type="submit" variant="success">
                  Processar venda
                </b-button>
              </b-col>
            </b-row>
          </b-form>
        </div>
        <b-card v-if="showQrCodeModal1" align="center" header="QR CODE VENDA AVULSA" header-text-variant="white"
          header-tag="header" header-bg-variant="dark"
          style="max-width: 20rem; margin: -35% 0 0% 32%; position: relative;">
          <b-card-text>
            <qrcode-vue style="margin-left: 1.50%;" :value="value1" :render-as="'svg'" level="Q" :size="size" />
          </b-card-text>
          <b-button size="sm" style="margin: 10% 0 0 10%;" @click="showQrCodeModal1 = false" variant="primary">REVISAR
          </b-button>
          <b-button size="sm" style="margin: 10% 0 0 25%;" @click="showQrCodeModalCancel1()" variant="danger">CANCELAR
          </b-button>
        </b-card>
      </b-tab>

      <!-- START VENDA CONTROLLER -->
      <b-tab title="CONTROLLER">
        <div :class="this.showQrCodeModal ? 'pointEventNon' : 'pointEvent'">
          <b-form @submit.prevent="onSubmitController" v-if="show">
            <b-row align-h="center">
              <b-col sm="3">
                <p class="formatControllerInput" style="text-align: center;">CPF:</p>
                <b-form-input class="formatInput" v-maska data-maska="['###.###.###-##']" id="input-1"
                  v-model="formC.cpfController" type="text" style="text-align: center;"></b-form-input>
                <b-row align-h="center">
                  <b-col>
                    <strong>
                      <p class="formatControllerInput" style="text-align: center;">
                        Adicionar Produto:</p>
                    </strong>
                    <b-form-select v-model="formC.selectProduto" :options="selectProdutos" single>
                    </b-form-select>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <b-row class="justify-content-md-center" style="margin-top:2%;">
              <b-col sm="2">
                <p style="white-space: pre;" class="formatControllerInput">Qtd produto(s)</p>
                <b-form-input class="formatInput" id="input-6" type="number" v-model="formC.quantityController">
                </b-form-input>
              </b-col>
              <b-col sm="2">
                <p style="white-space: pre; margin-left: 15%;" class="formatControllerInput">Valor R$:</p>
                <b-form-input style="margin-left: 15%;" class="formatInput" type="number"
                  v-model.lazy="formC.valorController"></b-form-input>
              </b-col>
              <b-col sm="1" style="margin: 6% 0 0 5%;">
                <b-button style="padding: 2px; " @click="adicionarProduto" variant="primary">Adicionar</b-button>
              </b-col>
            </b-row>
            <div class="d-flex justify-content-center">
              <transition name="fade">
                <div v-if="errorMessage" class="error-message">
                  {{ errorMessage }}
                </div>
              </transition>
            </div>
            <div class="d-flex justify-content-start">
              <span class="formatValueTotal">VALOR TOTAL: {{
                formatCurrency(totalValorController.toString()) }}
              </span>
            </div>

            <b-row align-h="center">
              <b-table style="max-width: 70%; max-height: 50vh; overflow-y:scroll" :items="dadosInseridos"
                :fields="tableFields" hover responsive="sm" :select-mode="'range'" selectable
                @row-selected="onRowSelected">
                <template #cell(cpfController)="row">
                  <div :style='{ color: this.isSelected ? "red" : "gray" }'>{{
                    row.item.cpfController.toString() }}
                  </div>
                </template>
                <template #cell(selectProduto)="row">
                  {{ getProdutoText(row.item.selectProduto)
                  }}
                </template>
                <template #cell(quantityController)="row">
                  {{ row.item.quantityController }}
                </template>
                <template #cell(valorController)="row">
                  {{
                    formatCurrency(row.item.valorController.toString()) }}
                </template>
              </b-table>
            </b-row>
            <div class="d-flex justify-content-end" style="margin: 2% 15.5% 10% 0;">
              <b-button v-b-tooltip.hover title="Excluir itens selecionados" type="reset" variant="danger"
                @click="deletarLinhasSelecionadas">
                <!-- <b-icon-trash style="margin-bottom: 20%;" /> -->
              </b-button>
            </div>
            <div class="d-flex justify-content-center">
              <transition name="fade">
                <div v-if="errorMessage2" class="error-message">
                  {{ errorMessage2 }}
                </div>
              </transition>
            </div>
            <b-row align-h="end">
              <b-col cols="4">
                <b-button v-b-tooltip.hover title="Prosseguir com venda" class="process" type="submit"
                  variant="success">Processar venda
                </b-button>
              </b-col>
            </b-row>
          </b-form>
        </div>
        <div class="d-flex justify-content-center">
          <b-card v-if="showQrCodeModal" align="center" header="QR CODE VENDA CONTROLLER" header-text-variant="white"
            header-tag="header" header-bg-variant="dark" style=" position: absolute; margin-top: -25%; max-width: 33%;">
            <div style="margin: 5%;">
              <b-card-text>
                <qrcode-vue :value="qrcodeValueController" :render-as="'canvas'" level="L" :options="qrcodeOptions" />
              </b-card-text>
            </div>
            <div style="margin-top: 15%;">
              <b-button size="sm" style="margin-right: 10%;" @click="showQrCodeModal = false" variant="primary">REVISAR
              </b-button>
              <b-button size="sm" @click="showQrCodeModalCancel()" variant="danger">CANCELAR
              </b-button>
            </div>
          </b-card>
        </div>
      </b-tab>
    </b-tabs>
  </div><br><br>
  <footer class="d-flex justify-content-center">Copyright &copy; {{ this.getNow() }}</footer>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { vMaska } from "maska"
import QrcodeVue from 'qrcode.vue'
// import { BIconTrash } from 'bootstrap-icons-vue'

export default defineComponent({
  name: 'App',
  directives: { maska: vMaska },

  data() {

    return {
      products: [],
      showQrCodeModal: false,
      showQrCodeModal1: false,

      qrcodeValueController: JSON.stringify(this.selectedRows),
      qrcodeOptions: {
        size: 29
      },

      value1: 'https://www.valeshop.com.br',
      size: 130,

      errorMessage: null,
      errorMessage2: null,


      tableFields: [
        { key: 'cpfController', label: 'CPF' },
        { key: 'selectProduto', label: 'Produto' },
        { key: 'quantityController', label: 'Quantidade' },
        { key: 'valorController', label: 'Valor R$' },
      ],


      getValueAvulso: [],

      dadosInseridos: [] as {
        id: number,
        cpfController: any,
        selectProduto: number,
        quantityController: number,
        valorController: number
      }[],



      selectedRows: [] as {
        id: number,
        cpfController: any,
        selectProduto: number,
        quantityController: number,
        valorController: number
      }[],



      form: {
        cpfAvulso: '',
        valorAvulso: '',
      },


      show: true,

      formC: {
        cpfController: '',
        selectProduto: '',
        quantityController: '',
        valorController: '',
      },

      selectProdutos: [
        { text: '', value: null },
        { text: 'two', value: 2 },
        { text: 'thre', value: 3 },
        { text: 'four', value: 4 },
        { text: 'thre', value: 3 },
      ]
    }
  },

  watch: {
    selectedRows: {
      deep: true,
      handler() {
        this.qrcodeValueController = JSON.stringify(this.selectedRows);
      }
    }
  },

  components: {
    QrcodeVue,
    // BIconTrash
  },

  computed: {

    totalValorController() {
      const total = this.selectedRows.reduce((total: any, row: any) => total + parseFloat(row.valorController), 0);
      return parseFloat(total.toFixed(2));
    }
  },

  mounted() {
    this.ops();
  },

  methods: {
    getNow() {
      const today = new Date();
      const date = today.getFullYear()
      return date;
    },
    //aqui é o fetch que eu faço para enviar os dados para algum endpoint, se necessario
    // enviarDados() {
    //   const url = 'http://localhost:3000/dadospag';
    //   const dados = { dadospag: this.selectedRows };

    //   fetch(url, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(dados)
    //   })
    //     .then(response => response.json())
    //     .then(data => {
    //     })
    //     .catch(error => {
    //       console.log(error)
    //     });
    // },

    async ops() {
      try {
        const response = await fetch('http://localhost:3000/produtos');
        const data = await response.json();

        // Mapeia os dados para o formato esperado pelo :options
        this.selectProdutos = data.map((product: { title: any; id: any }) => ({
          text: product.title,
          value: product.id,
        }));
      } catch (error) {
        console.error('Error fetching products:', error);
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


    showErrorMessage2(message: string, timeout = 6000) {
      this.errorMessage2 = message;

      setTimeout(() => {
        this.errorMessage2 = null;
      }, timeout);
    },

    validaVenda() {
      if (this.selectedRows.length === 0) {
        this.showErrorMessage2('Selecione pelo menos um produto para processar a venda.');
        return false;
      }
      return true;
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
      if (formulario.cpfController != this.selectedRows.cpfController) {
        this.showErrorMessage('Somente um CPF/CNPJ por venda.');
        return false;
      }
      return true;
    },


    getProdutoText(value: number) {
      const produto = this.selectProdutos.find((prod: { value: number }) => prod.value === value);

      return produto ? produto.text : '';
    },


    deletarLinhasSelecionadas() {
      this.dadosInseridos = this.dadosInseridos.filter((item: any) => !this.selectedRows.includes(item));

      this.formC.selectProduto = 1
      this.selectedRows = [];
    },

    onRowSelected(item: any, index: number, event: Event) {
      this.isSelected = this.selectedRows.includes(item);
      console.log(this.isSelected, ' bool')
      // const isSelected = this.isSelected(item);
      if (this.isSelected) {
        this.selectedRows = this.selectedRows.filter((row: any) => row !== item);
      } else {
        this.selectedRows.push(item);
      }
      // return isSelected
    },

    isSelected(item: any) {
      let guard = this.selectedRows.includes(item)

      if (guard != true) {
        console.log('desmarcou')
      } else {
        console.log('marcou')
      }
      return this.selectedRows.includes(item);
    },
    toggleSelect(item: any) {
      const isSelected = this.isSelected(item);
      if (isSelected) {
        this.selectedRows = this.selectedRows.filter((selectedItem: any) => selectedItem !== item);
      } else {
        this.selectedRows.push(item);
      }
    },

    attAvulso() {
      let valorString = this.form.valorAvulso;

      const valorFinish = parseFloat(valorString.replace(/\D/g, '')) / 100;

      return valorFinish
    },

    async adicionarProduto() {
      const valorString = this.formC.valorController;

      const valorNumerico = parseFloat(valorString.replace(/\D/g, '')) / 100;

      if (!this.validaForm(this.formC)) {
        return;
      }

      if (this.dadosInseridos.length === 0) {

        this.dadosInseridos.push({
          id: this.dadosInseridos.length + 1,
          cpfController: this.formC.cpfController,
          selectProduto: this.formC.selectProduto,
          quantityController: this.formC.quantityController,
          valorController: valorNumerico
        });
        this.formC.selectProduto = '';
        this.formC.quantityController = '';
        this.formC.valorController = '';
      } else {
        const primeiroCPF = this.dadosInseridos[0].cpfController;

        if (primeiroCPF === this.formC.cpfController) {
          this.dadosInseridos.push({
            id: this.dadosInseridos.length + 1,
            cpfController: this.formC.cpfController,
            selectProduto: this.formC.selectProduto,
            quantityController: this.formC.quantityController,
            valorController: valorNumerico
          });

          this.formC.selectProduto = '';
          this.formC.quantityController = '';
          this.formC.valorController = '';
        } else if (this.validaCpf(this.formC)) {
          return;
        }
      }

      await this.ops()
    },

    onSubmit(event: any) {

      if (!this.validaForm(this.form)) {
        return;
      }
      console.log(this.form.valorAvulso, 'antes do insert')
      this.getValueAvulso.push(this.attAvulso())

      console.log(this.getValueAvulso, 'inserindo dados lcoal')

      this.showQrCodeModal1 = true;

      // if (this.showQrCodeModal1)

      console.log(JSON.stringify(this.form))
      console.log(this.attAvulso())

    },

    showQrCodeModalCancel() {
      this.selectedRows = []
      this.dadosInseridos = []
      this.showQrCodeModal = false
    },

    showQrCodeModalCancel1() {
      this.form.cpfAvulso = '';
      this.form.valorAvulso = '';
      this.showQrCodeModal1 = false
    },

    async onSubmitController(event: any) {
      if (!this.validaVenda()) {
        return;
      } else {

        console.log(JSON.stringify(this.selectedRows), 'flops')
        console.log((+this.totalValorController.toString()), 'ens1')
        // await this.enviarDados()
        this.showQrCodeModal = true;
      }
    },
  }
})
</script>