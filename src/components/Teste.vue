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
  text-align: center;
  margin-left: -10%;
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
</style>
<template>
  <div style="transform: scale(0.9); font-family: 'Nunito Sans', sans-serif;">
    <div style="margin-top: -10%;">
      <b-card no-body>
        <b-tabs card align="center" style="">
          <b-tab title="AVULSA">
            <div style="margin-top: 5%;">
              <b-form @click="onSubmit">
                <b-row align-h="center">
                  <b-col cols="3">
                    <b-form-group class="formatTxtLabel1" id="input-group-1" label="CPF:" label-for="input-1">
                      <b-form-input style="text-align: center;" class="formatLabel" id="input-1" v-maska
                        data-maska="['###.###.###-##']" v-model="form.cpfAvulso" type="text" required></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row align-h="center">
                  <b-col cols="3">
                    <b-form-group class="ajusteAv" id="input-group-2" label="Valor R$:" label-for="input-2">
                      <money3 class="formatInputMoney1" id="input-2" v-model="form.valorAvulso" v-bind="config"
                        required />
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row align-h="end">
                  <b-col cols="3" style="margin-top: 10%;">
                    <b-button type="submit" variant="success">Processar venda</b-button>
                  </b-col>
                </b-row>
              </b-form><br><br>
            </div>
          </b-tab>

          <b-tab title="CONTROLLER">
            <div style="margin-top: 5%;">
              <b-form @submit="submitCardController">

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
                        <money3 class="formatInputMoney" id="input-6" v-model="formC.valorController" v-bind="config"
                          required />
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
            </div><br><br><br>

            <EasyDataTable style="transform: scale(1.03);" v-model:items-selected="itemsSelected" :headers="headers"
              border-cell theme-color="#1d90ff" table-class-name="customize-table" :items="formattedItems" />
            <br><br>
            <b-row align-h="end">
              <b-col cols="4">
                <b-button type="submit" @click="processSale" variant="success" styl>Processar venda</b-button>
              </b-col>
            </b-row>
            <br><br><br>
            itemsSelected: <br><br>
            {{ itemsSelected }} <br>
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Header, Item } from "vue3-easy-data-table";
import { Money3Component } from "v-money3";
import { vMaska } from "maska"
export default {
  directives: {
    maska: vMaska,
  },
  components: {
    money3: Money3Component,

  },
  data() {

    const headers: Header[] = [
      { text: "CPF", value: "cpfController", width: 160 },
      { text: "PRODUTO", value: "produto", width: 220 },
      { text: "QUANTIDADE", value: "quantidade", width: 100 },
      { text: "VALOR PRODUTO R$", value: "valorController", width: 160 }
    ];


    const items: Item[] = [];

    // const itemsSelected: Item[] = [];
    const itemsSelected: {
      cpfController: number,
      selectProduto: string,
      quantityController: number,
      valorController: any
    }[] = [];


    return {
      errorMessage: null,

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
      itemsSelected,
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

    totalValorController() {

      let total = this.itemsSelected.reduce(getTotal, 0);

      function getTotal(total: any, item: any) {

        let valorString = item.valorController;
        const removeCaracter = valorString.replace(/R\$\s*/, '')
        console.log(valorString, 'valor nao formatado')

        const valorNumerico = parseFloat(removeCaracter.replace(/\D/g, '')) / 100;

        console.log(valorNumerico, 'valor formated')

        return total + (valorNumerico * +item.quantidade);
      }

      let totalFormated = parseFloat(total.toFixed(2))

      return totalFormated;
    }
  },


  methods: {
    onSubmit(event: any) {
      event.preventDefault()
      console.log(JSON.stringify(this.form))
    },

    submitCardController(event: any) {
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

    processSale(event: any) {
      event.preventDefault()
      const results = this.itemsSelected
      if (this.itemsSelected.length === 0) {
        console.log('xi felas, mandando bagulho vazio')
      } else {
        console.log(this.totalValorController)
        console.log(`Segue lista de itens solicitados: ${JSON.stringify(results)}`)
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
      if (this.formC.valorController === "0.00") {
        this.showErrorMessage('Por Favor, preencha o campo VALOR!')
      }
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
    }
  }
}
</script>
