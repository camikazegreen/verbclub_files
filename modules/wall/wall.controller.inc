<?php

class WallController extends DrupalDefaultEntityController {
    
    public function save($wall) {
        drupal_write_record('walls', $wall);
        field_attach_insert('wall', $wall);
        module_invoke_all('entity_insert', 'wall', $wall);
    
	 return $wall;
    }

	public function buildContent($entity, $view_mode = 'full', $langcode = NULL, $content = array()) {
	    $content = parent::buildContent($entity, $view_mode, $langcode, $content);
	    $content['wall_sample_data'] =  array(
	      '#markup' => theme('wall_sample_data', array('wall_sample_data' => check_plain($entity->longitude['longitude']), 'wall' => $entity)),
	    );

    return $content;
  }
  
}

