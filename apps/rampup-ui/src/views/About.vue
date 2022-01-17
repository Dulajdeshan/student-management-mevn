<template>
  <Grid
    ref="grid"
    :style="{ height: '440px' }"
    :data-items="gridData"
    :edit-field="'inEdit'"
    :sortable="true"
    :pageable="pageable"
    :take="take"
    :skip="skip"
    :total="total"
    @itemchange="itemChange"
    @datastatechange="dataStateChange"
    :columns="columns"
  >
    <template v-slot:myTemplate="{ props }">
      <custom
        :data-item="props.dataItem"
        @edit="edit"
        @save="save"
        @remove="remove"
        @cancel="cancel"
      />
    </template>
    <grid-toolbar>
      <button title="Add new" class="k-button k-primary" @click="insert">
        Add new
      </button>
      <button
        v-if="hasItemsInEdit"
        title="Cancel current changes"
        class="k-button"
        @click="cancelChanges"
      >
        Cancel current changes
      </button>
    </grid-toolbar>
    <grid-norecords> There is no data available custom </grid-norecords>
  </Grid>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { process } from "@progress/kendo-data-query";
import { Grid, GridToolbar, GridNoRecords } from "@progress/kendo-vue-grid";
import CommandCell from "../components/CommandCell.vue";

@Options({
  components: {
    Grid: Grid,
    "grid-toolbar": GridToolbar,
    "grid-norecords": GridNoRecords,
    custom: CommandCell,
  },
  data: function () {
    return {
      filter: null,
      sort: null,
      pageable: true,
      gridData: [],
      skip: 0,
      take: 10,
      total: 10,
      updatedData: [],
      editID: null,
      columns: [
        {
          field: "id",
          filterable: false,
          editable: false,
          title: "ID",
          width: "80px",
          type: "numeric",
        },
        { field: "name", title: "Name" },
        { field: "gender", title: "Gender" },
        { field: "address", title: "Address" },
        { field: "mobile", title: "Mobile" },
        {
          field: "dob",
          title: "Date of Birth",
          filter: "date",
          editor: "date",
          format: "{0:d}",
        },
        {
          field: "id",
          title: "Age",
          filter: "numeric",
          editable: false,
          cell: this.cellFunction,
        },
        { cell: "myTemplate", filterable: false, width: "210px" },
      ],
    };
  },
  computed: {
    hasItemsInEdit() {
      return this.gridData.filter((p: any) => p.inEdit).length > 0;
    },
  },
  created: async function () {
    const students = await this.fetchStudents();
    this.updatedData = students.map((student: any) => this.formatData(student));
    this.getData();
  },
  methods: {
    formatData: (data: any) => {
      return {
        ...data,
        dob: new Date(data.dob),
      };
    },
    cellFunction: function (
      h: any,
      tdElement: any,
      props: any,
      listeners: any
    ) {
      return h("td", [this.calculateAge(props.dataItem.dob)]);
    },
    calculateAge: function (dob: Date) {
      if (dob) {
        var diff_ms = Date.now() - dob.getTime();
        var age_dt = new Date(diff_ms);

        return Math.abs(age_dt.getUTCFullYear() - 1970);
      }

      return "";
    },
    itemChange: function (e: any) {
      if (e.dataItem.id) {
        let index = this.gridData.findIndex((p: any) => p.id === e.dataItem.id);
        let updated = Object.assign({}, this.gridData[index], {
          [e.field]: e.value,
        });
        this.gridData.splice(index, 1, updated);
      } else {
        e.dataItem[e.field] = e.value;
      }
    },
    insert() {
      const dataItem = { inEdit: true };
      this.gridData.splice(0, 0, dataItem);
    },
    edit: function (e: any) {
      let index = this.gridData.findIndex((p: any) => p.id === e.dataItem.id);
      let updated = Object.assign({}, this.gridData[index], { inEdit: true });
      this.gridData.splice(index, 1, updated);
    },
    save: async function (e: any) {
      let index = this.gridData.findIndex((p: any) => p.id === e.dataItem.id);
      let item = this.gridData[index];
      const response = await this.update(this.gridData.slice(), item);
      let updated = Object.assign(response, {
        inEdit: undefined,
      });
      this.gridData.splice(index, 1, updated);
      let updateDataIndex = this.updatedData.findIndex(
        (p: any) => p.id === e.dataItem.id
      );
      this.updatedData.splice(updateDataIndex, 1, updated);
    },
    update: async function (data: any, item: any, remove: any) {
      let index = data.findIndex((p: any) => item.id && p.id === item.id);
      if (index >= 0) {
        const updatedStudent = Object.assign({}, item);
        const response = await this.updateStudent(updatedStudent);
        if (response !== null) {
          return this.formatData(response);
        } else {
          return this.updatedData[index];
        }
      } else {
        return this.updatedData[index];
      }
    },
    cancel(e: any) {
      if (e.dataItem.id) {
        let index = this.gridData.findIndex((p: any) => p.id === e.dataItem.id);
        let updateDataIndex = this.updatedData.findIndex(
          (p: any) => p.id === e.dataItem.id
        );
        let updated = Object.assign(this.updatedData[updateDataIndex], {
          inEdit: undefined,
        });
        this.gridData.splice(index, 1, updated);
      } else {
        let index = this.gridData.findIndex(
          (p: any) => JSON.stringify(e.dataItem) === JSON.stringify(p)
        );

        this.gridData.splice(index, 1);
      }
    },
    remove(e: any) {
      e.dataItem.inEdit = undefined;
      this.update(this.gridData, e.dataItem, true);
      this.update(this.updatedData, e.dataItem, true);
    },
    cancelChanges() {
      let editedItems = this.updatedData.filter((p: any) => p.inEdit === true);
      if (editedItems.length) {
        editedItems.forEach((item: any) => {
          item.inEdit = undefined;
        });
      }
      this.getData();
    },
    getData: function () {
      this.gridData = process(this.updatedData, {
        take: this.take,
        skip: this.skip,
        sort: this.sort,
        filter: this.filter,
      }).data;

      this.total = process(this.updatedData, {
        filter: this.filter,
      }).total;
    },
    createAppState: function (dataState: any) {
      this.take = dataState.take;
      this.skip = dataState.skip;
      this.filter = dataState.filter;
      this.sort = dataState.sort;
      this.getData();
    },
    dataStateChange: function (event: any) {
      this.createAppState(event.data);
    },
    fetchStudents: async function () {
      return fetch("http://localhost:3000/graphql", {
        method: "POST",
        body: JSON.stringify({
          query: `query {
                getAllStudents{
                  id
                  name,
                  gender,
                  mobile,
                  dob,
                  address
                }
              }`,
        }),
        headers: {
          "content-type": "application/json",
        },
      })
        .then(async (response) => {
          const jsonResponse = await response.json();
          return jsonResponse.data.getAllStudents;
        })
        .catch((e) => {
          console.error(e);
          return [];
        });
    },
    updateStudent: async function (student: any) {
      return fetch("http://localhost:3000/graphql", {
        method: "POST",
        body: JSON.stringify({
          query: `mutation {
                updateStudent(student: {
                  id: ${student.id}
                  name: "${student.name}"
                  gender: "${student.gender}"
                  mobile: "${student.mobile}"
                  dob: "${student.dob}"
                  address: "${student.address}"
                }){
                  id
                  name,
                  gender,
                  mobile,
                  dob,
                  address
                }
              }`,
        }),
        headers: {
          "content-type": "application/json",
        },
      })
        .then(async (response) => {
          const jsonResponse = await response.json();
          console.log("SUCCESS", jsonResponse);
          return jsonResponse.data.updateStudent;
        })
        .catch((e) => {
          console.error(e);
          return null;
        });
    },
  },
})
export default class Home extends Vue {}
</script>
