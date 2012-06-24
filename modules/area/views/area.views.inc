<?php
 
function area_views_data() {
  $data['areas']['table']['group'] = t('Verb Club');
  $data['areas']['table']['base'] = array(
     'title' => t('Areas'),
     'help' => t('This represents areas.'), // The help that appears on the UI,
     'field' => 'aid',
     );
     
   $data['areas']['aid'] = array(
     'title' => t('Area ID'),
     'help' => t('The id of the area.'), // The help that appears on the UI,
     'field' => array(
        'click sortable' => TRUE,
        'handler' => 'views_handler_field',
        ),
     );  
  $data['areas']['name'] = array(
     'title' => t('Area name'),
     'help' => t('The name of the area.'), // The help that appears on the UI,
     'field' => array(
        'click sortable' => TRUE,
        'handler' => 'views_handler_field',
        ),
     );
     
//   $data['areas']['description'] = array(
//     'title' => t('Description'),
//     'help' => t('The description of the area.'), // The help that appears on the UI,
//     'field' => array(
//        'click sortable' => FALSE,
//        'handler' => 'views_handler_field',
//        ),
//     );
 
  $data['areas']['parent'] = array(
     'title' => t('Parent'),
     'help' => t('Is this area a parent?'), // The help that appears on the UI,
     'field' => array(
        'click sortable' => TRUE,
        'handler' => 'views_handler_field',
        ),
   );

  $data['areas']['latitude'] = array(
     'title' => t('Latitude'),
     'help' => t('The latitude of an area.'), // The help that appears on the UI,
     'field' => array(
        'click sortable' => TRUE,
        'handler' => 'views_handler_field',
        ),
     );
   $data['areas']['longitude'] = array(
     'title' => t('Longitude'),
     'help' => t('The longitude of an area.'), // The help that appears on the UI,
     'field' => array(
        'click sortable' => TRUE,
        'handler' => 'views_handler_field',
        ),
     );
     
function area_views_data_alter(&$data) { 
    $data['areas']['link_area'] = array(
    'field' => array(
      'title' => t('Link'),
      'help' => t('Provide a link to the area.'),
      'handler' => 'area_handler_link_field',
    ),
  );
  $data['areas']['edit_area'] = array(
    'field' => array(
      'title' => t('Edit Link'),
      'help' => t('Provide a link to the edit form for the area.'),
      'handler' => 'area_handler_edit_link_field',
    ),
  );
  $data['areas']['delete_area'] = array(
    'field' => array(
      'title' => t('Delete Link'),
      'help' => t('Provide a link to delete the area.'),
      'handler' => 'area_handler_delete_link_field',
    ),
  );
  // This content of this field are decided based on the menu structure that
  // follows areas/area/%area_id/op
  $data['areas']['operations'] = array(
    'field' => array(
      'title' => t('Operations links'),
      'help' => t('Display all operations available for this area.'),
      'handler' => 'area_handler_area_operations_field',
    ),
  );
}

   
  return $data;
}
