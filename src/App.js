import React, { Component } from 'react';
import axios from 'axios';
import 'semantic-ui-css/semantic.min.css';
import { Grid, Header, Image, Input, Button, Segment, Icon,
        Table } from 'semantic-ui-react';


class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      dataApi: [],
      edt: false,
      dataPost:{
        id: 0,
        nama_karyawan:"",
        jabatan: "",
        jenis_kelamin: "",
        tanggal_lahir: ""
      }
    };

    this.handleRemove = this.handleRemove.bind(this);
    this.inputChange = this.inputChange.bind(this);

  }

  reloadData(){
    axios.get('http://localhost:3004/data-karyawan')
    .then( res => {
      this.setState({
        dataApi: res.data,
        edit: false
      })
    });
  }

  inputChange(e) {
    let newdataPost = {...this.state.dataPost};
    if(this.state.edit === false){
      newdataPost['id'] = new Date().getTime();
    }
    newdataPost[e.target.name] = e.target.value;

    this.setState(
      {
        dataPost: newdataPost
      },
        () => console.log(this.state.dataPost)
      );
    }

  clearData = ()=> {
    let newdataPost = {...this.state.dataPost};

      newdataPost['id'] = "";
      newdataPost['nama_karyawan'] = "";
      newdataPost['jabatan'] = "";
      newdataPost['jenis_kelamin'] = "";
      newdataPost['tanggal_lahir'] = "";

    this.setState({
      dataPost: newdataPost
    });
  }

  onSubmitForm = ()=> {
    if(this.state.edit === false){
    axios.post(`http://localhost:3004/data-karyawan`, this.state.dataPost)
      .then(() => {this.reloadData();
        this.clearData();

      });
    }else{
      axios.put(`http://localhost:3004/data-karyawan/${this.state.dataPost.id}`, this.state.dataPost).then(() => {
          this.reloadData();
            this.clearData();
          });
    }
  };

  getDataId=(e)=>{
    axios.get(`http://localhost:3004/data-karyawan/${e.target.value}`).then(res => {
        this.setState({
          dataPost: res.data,
          edit: true
        });
      });
  };

  handleRemove(e){
    console.log(e.target.value);
    fetch(`http://localhost:3004/data-karyawan/${e.target.value}`,
    {
      method: 'DELETE'
    }).then(res => this.reloadData());
  }

  componentDidMount(){
    // fetch(`https://jsonplaceholder.typicode.com/posts`)
    //   .then(respone => respone.json())
    //   .then(res => {
    //     this.setState({
    //       dataApi: res
    //     })
    //   })
    this.reloadData();
  }

  render() {
    return(
      <div>
      <br />
        <Header textAlign='center' as='h1' color='teal'>
          <Image bordered src='https://s3-ap-southeast-1.amazonaws.com/niomic/img-v1/c_login_logo.png'/>
            DATA KARYAWAN
        </Header>
        <br />

          <Segment stacked textAlign='center'>
          <Input value={this.state.dataPost.nama_karyawan} type='text' name='nama_karyawan'
              iconPosition='left' icon='users' placeholder='Masukan Nama Karyawan' onChange={this.inputChange} />&nbsp;&nbsp;

          <Input value={this.state.dataPost.jabatan} type='text' name='jabatan'
            iconPosition='left' icon='briefcase' placeholder='Masukan Jabatan' onChange={this.inputChange} />&nbsp;&nbsp;

          <Input value={this.state.dataPost.jenis_kelamin} type='text' name='jenis_kelamin'
            iconPosition='left' icon='venus mars' placeholder='Jenis Kelamin' onChange={this.inputChange} />&nbsp;&nbsp;

          <Input value={this.state.dataPost.tanggal_lahir} type='date' name='tanggal_lahir'
             iconPosition='left' icon='calendar alternate' placeholder='mm/dd/yyyy' onChange={this.inputChange} />&nbsp;&nbsp;

          <Button iconPosition='left'  color='blue' type='submit' onClick={this.onSubmitForm}>
            <Icon name='plus' />Save</Button>&nbsp;&nbsp;
          </Segment>



        {this.state.dataApi.map((dat, index) =>
          {
            return(

              <div>
              <br /><br />

              <Grid textAlign='center'>
              <Grid.Column style={{ maxWidth: 1200 }}>
              <Table key={index} textAlign='center' celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>ID</Table.HeaderCell>
                    <Table.HeaderCell>Nama Karyawan</Table.HeaderCell>
                    <Table.HeaderCell>Jabatan</Table.HeaderCell>
                    <Table.HeaderCell>Jenis Kelamin</Table.HeaderCell>
                    <Table.HeaderCell>Tanggal Lahir</Table.HeaderCell>
                    <Table.HeaderCell>Action</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body textAlign='center'>
                  <Table.Row>
                    <Table.Cell>{dat.id}</Table.Cell>
                    <Table.Cell>{dat.nama_karyawan}</Table.Cell>
                    <Table.Cell>{dat.jabatan}</Table.Cell>
                    <Table.Cell>{dat.jenis_kelamin}</Table.Cell>
                    <Table.Cell>{dat.tanggal_lahir}</Table.Cell>
                    <Table.Cell>
                      <Button iconPosition='left' color='green' value={dat.id} onClick={this.getDataId}>
                        <Icon name='edit' />Edit
                      </Button>

                      <Button iconPosition='left' color='red' value={dat.id} onClick={this.handleRemove}>
                        <Icon name='trash alternate' />Delete
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
              </Grid.Column>
              </Grid>
              </div>






            );
          })}
      </div>
    )
  }
}

export default App;
